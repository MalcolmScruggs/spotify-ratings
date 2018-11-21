import React from 'react';
import axios from 'axios';
import _ from 'lodash';

import Song from './song';

export default class TrackList extends React.Component { //TODO rename
    constructor(props) {
        super(props);

        this.state = {
            songs: new Map(),
            user_id: props.user_id,
            offset: 0,
            max_load:  false
        };
        this.socket = props.socket;
        this.channels = new Map(); //song_id to channel
        this.api_url = props.api_url;
        this.title = props.title;
        this.page_size = 50; //max allowed by spotify API
    }

    componentDidMount() {
        this.fetchSongsAndJoinChannels();
    }

    componentWillUnmount() {
        this.channels.forEach((channel) => {
            channel.leave(); //leave any previously joined channels
        });
    }

    fetchSongsAndJoinChannels() {
        axios.get(this.api_url,
                  {params:{offset: this.state.offset * this.page_size},
                  validateStatus: function (status) {
                          return status >= 200 && status < 300 && status !== 204; // default
                      },})
            .then((resp) => {
                this.channels = new Map();

                let data = resp.data;
                let songs = data.data;
                let songsMap = this.state.songs;
                songs.forEach((song) => {
                    let channel = this.socket.channel("song:" + song.id);
                    channel.join()
                        .receive("ok", resp => {
                            //console.log("Joined successfully")
                        })
                        .receive("error", resp => { console.log("Unable to join", resp) });
                    channel.on("new:msg", this.gotRating.bind(this));
                    this.channels.set(song.id, channel);
                    songsMap.set(song.id, song);
                });
                this.setState({songs: songsMap});
            }).catch((error) => {
                if (error.response.status === 204) {
                    this.setState({max_load: true});
                } else {
                    console.log(error);
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
            .receive("ok", this.gotRating.bind(this));
    }

    nextPage() {
        if (this.state.max_load) {
            return;
        }
        this.setState((state) => {
            return {offset: state.offset + 1}
        }, () => this.fetchSongsAndJoinChannels());
    }

    createPlaylist() { //todo create ui for this
        let songs = [];
        this.state.songs.forEach((song, id) => {
            songs.push(song.uri)
        });
        axios.post("/api/v1/playlist/create", {
                title: this.title,
                songs: songs
            })
            .then((resp) => console.log(resp))
            .catch((error) => console.log(error))
    }

    render() {
        let songs = [];
        this.state.songs.forEach((song, id) => {
            songs.push(<Song song={song} key={id} root={this} />)
        });
        let more = null;
        if (!this.state.max_load) {
            more = <div className="btn btn-primary mb-3" onClick={() => {this.nextPage()}}>more</div>;
        }
        return <div>
            <div className="mb-4"><h2>{this.title}</h2></div>
            <table className="table table-sm">
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
            <div>
                {more}
                <div className="btn btn-primary ml-3 mb-3" onClick={() => {this.createPlaylist()}}>create playlist</div>
            </div>
            </div>
    }
}