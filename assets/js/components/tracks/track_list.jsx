import React from 'react';
import axios from 'axios';
import _ from 'lodash';
import { withAlert } from 'react-alert'

import Song from './song';
import PlaylistCreate from '../playlist_create'

class TrackList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            songs: new Map(),
            user_id: props.user_id,
            offset: 0,
            max_load:  false
        };

        this.socket = props.socket;
        this.CancelToken = axios.CancelToken; //for canceling axios request
        this.source = this.CancelToken.source(); //for canceling axios request

        this.channels = new Map(); //song_id to channel
        this.api_url = props.api_url;
        this.title = props.title;
        this.page_size = 50; //max allowed by spotify API
        this.isSearch = props.isSearch || true;
        this.query = props.query || null;
        this.isPrivate = props.isPrivate || false;

        this.createPlaylist = this.createPlaylist.bind(this);
    }

    componentDidMount() {
        this.fetchSongsAndJoinChannels();
    }

    componentWillUnmount() {
        this.source.cancel();
        this.channels.forEach((channel) => {
            channel.leave(); //leave any previously joined channels
        });
    }

    computeRequestParams() {
        if (this.isSearch) {
            return {offset: this.state.offset * this.page_size, query: this.query};
        } else {
            return {offset: this.state.offset * this.page_size}
        }
    }

    fetchSongsAndJoinChannels() {
        let params = this.computeRequestParams();
        axios.get(this.api_url,
                  {params: params,
                  cancelToken: this.source.token,
                  validateStatus: function (status) {
                          return status >= 200 && status < 300 && status !== 204; // override default for 204 no more content resp.
                      },})
            .then((resp) => {
                let data = resp.data;
                let songs = data.data;
                let songsMap = this.state.songs;
                songs.forEach((song) => {
                    let channel = this.socket.channel(`song:${song.id}${this.isPrivate ? this.state.user_id : ""}`);
                    channel.join()
                        .receive("error", resp => { console.log("Unable to join", resp) });
                    channel.on("new:msg", this.gotRating.bind(this));
                    this.channels.set(song.id, channel);
                    songsMap.set(song.id, song);
                });
                this.setState({songs: songsMap});
            }).catch((error) => {
                if (error.response.status === 204) {
                    this.setState({max_load: true});
                    this.props.alert.info("All songs loaded")
                } else {
                    console.log(error);
                    this.props.alert.error("Failed to load songs")
                }
            });
    };

    gotRating(value) {
        let {rating, song_id, user_rating} = value;
        let songs = this.state.songs;
        let modified = songs.get(song_id);
        modified.rating = rating;
        songs.set(song_id, modified);
        this.setState(_.assign({}, this.state, {songs}));
    }

    onStarClick(nextValue, _prevValue, name) {
        let data = {
            user_id: this.state.user_id,
            song_id: name,
            stars: nextValue
        };

        let channel = this.channels.get(name);
        channel.push("rate", {song_rating: data})
            .receive("ok", this.gotRating.bind(this))
            .receive("error", () => { this.props.alert.error("Failed to create rating")});
    }

    nextPage() {
        if (this.state.max_load) {
            return;
        }
        this.setState((state) => {
            return {offset: state.offset + 1}
        }, () => this.fetchSongsAndJoinChannels());
    }

    createPlaylist(title, minRating) {
        let songs = [];
        this.state.songs.forEach((song, id) => {
            if(song.rating && parseFloat(song.rating) >= minRating) {
                songs.push(song.uri);
            }
        });
        if (songs.length === 0) {
            this.props.alert.info("No songs meet criteria.");
            return;
        }
        axios.post("/api/v1/playlist/create", {
                title: title,
                songs: songs
            })
            .then((resp) => this.props.alert.success("Playlist created"))
            .catch((error) => this.props.alert.error("Failed to create playlist"))
    }

    render() {
        let songs = [];
        this.state.songs.forEach((song, id) => {
            songs.push(<Song song={song} key={id} root={this} />)
        });
        let more = null;
        if (!this.state.max_load) {
            more = <div className="btn btn-primary mb-3  mr-3" onClick={() => {this.nextPage()}}>more</div>;
        }
        return <div>
            <div className="mb-4 mt-3"><h2>{this.title}</h2></div>
            <table className="table table-sm mb-0">
                <colgroup>
                    <col style={{width: "50%"}}/>
                    <col style={{width: "30%"}} />
                    <col style={{width: "20%"}} />
                    <col style={{width: "0%"}} />
                </colgroup>
                <thead><tr>
                    <th className="text-uppercase">Title</th>
                    <th className="text-uppercase">Artist</th>
                    <th className="text-uppercase">Album</th>
                    <th className="text-uppercase" style={{minWidth: "90px"}}>Rating</th>
                </tr></thead>
                <tbody>
                {songs}
                </tbody>
            </table>
            <div className="text-muted text-right">
                Ratings displayed are {this.isPrivate ? "personal" : "public averages"}
            </div>
            <div>
                {more}
                <PlaylistCreate create={this.createPlaylist} titlePlacehold={this.title} />
            </div>
        </div>
    }
}

export default withAlert(TrackList)