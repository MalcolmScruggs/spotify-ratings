import React from 'react';
import axios from 'axios';
import _ from 'lodash';
import StarRatingComponent from 'react-star-rating-component';

export default class SavedTracks extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            songs: new Map(),
            user_id: null,
            offset: 0
        };
        this.socket = props.socket;
        this.channels = new Map(); //song_id to channel
        this.api_url = props.api_url;
    }

    componentDidMount() {
        this.fetchSongsAndJoinChannels();
    }

    componentWillUnmount() {
        console.log("unmount");
        this.channels.forEach((channel) => {
            channel.leave(); //leave any previously joined channels
        });
    }

    fetchSongsAndJoinChannels() {
        this.channels.forEach((channel) => {
            channel.leave(); //leave any previously joined channels
        });
        this.channels = new Map();
        axios.get(this.api_url, {params:{offset: this.state.offset * 50}})
            .then((resp) => {
                let data = resp.data;
                let songs = data.data;
                let songsMap = new Map();
                songs.forEach((song) => {
                    let channel = this.socket.channel("song:" + song.id);
                    channel.join()
                        .receive("ok", resp => {
                            //console.log("Joined successfully", resp)
                        })
                        .receive("error", resp => { console.log("Unable to join", resp) });
                    channel.on("new:msg", this.gotRating.bind(this));
                    this.channels.set(song.id, channel);
                    songsMap.set(song.id, song);
                });
                this.setState({songs: songsMap, user_id: data.user_id});})
            .catch((error) => {
                console.log(error);
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
        this.setState((state) => {
            return {offset: state.offset + 1}
        }, () => this.fetchSongsAndJoinChannels());
    }

    prevPage() {
        this.setState((state) => {
            return {offset: state.offset - 1}
        }, () => this.fetchSongsAndJoinChannels());
    }

    render() {
        let songs = [];
        this.state.songs.forEach((song, id) => {
            songs.push(<Song song={song} key={id} root={this} />)
        });
        let prev = null;
        if (this.state.offset > 0) {
            prev = <div className="btn btn-primary mr-3 mb-3" onClick={() => {this.prevPage()}}>prev</div>;
        }
        return <div>
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
                {prev}
                <div className="btn btn-primary mb-3" onClick={() => {this.nextPage()}}>next</div>
            </div>
            </div>
    }
}

function Song(props) {
    let {song, root} = props;
    let {album, artists, id, name} = song;
    let rating = Math.round(song.rating);
    //TODO distinguish between global averages and personal ratings (toggle?)
    //TODO delete ratings by clicking on star value?
    return <tr>
        <td className="text-truncate" style={{maxWidth: "1px"}}>{name}</td>
        <td className="text-truncate" style={{maxWidth: "1px"}}>{artists}</td>
        <td className="text-truncate" style={{maxWidth: "1px"}}>{album}</td>
        <td><StarRatingComponent
                name={id}
                starCount={5}
                value={rating}
                onStarClick={root.onStarClick.bind(root)}
                starColor="#1DB954"
        />
        </td>
    </tr>
}