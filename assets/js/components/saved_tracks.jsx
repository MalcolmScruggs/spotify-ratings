import React from 'react';
import axios from 'axios';
import _ from 'lodash';
import StarRatingComponent from 'react-star-rating-component';

export default class SavedTracks extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            songs: [],
            user_id: null
        }
    }

    componentDidMount() {
        axios.get("/api/v1/saved_songs")
            .then((resp) => {
                let data = resp.data;
                this.setState({songs: data.songs, user_id: data.user_id});})
            .catch((error) => {
                console.log(error);
            })
    }

    onStarClick(nextValue, prevValue, name) {
        let data = {
            user_id: this.state.user_id,
            song_id: name,
            stars: nextValue
        };

        console.log(data);

        axios.post('/api/v1/song_ratings', {
            song_rating: data
        }).then((resp) => {
            alert(resp);
            console.log(resp);
        })
    }

    render() {
        let songs = _.map(this.state.songs, (song) => {
            return <Song song={song} key={song.id} root={this} />
        });
        return <table className="table table-sm">
            <thead><tr>
                <th className="text-uppercase">Title</th>
                <th className="text-uppercase">Artist</th>
                <th className="text-uppercase">Album</th>
                <th className="text-uppercase" style={{minWidth: "90px"}}>Rating</th>
            </tr></thead>
            <tbody>
                {songs}
            </tbody>
        </table>;
    }
}

function Song(props) {
    console.log(props);
    let {song, root} = props;
    let {album, artists, id, name} = song;
    let rating = Math.round(song.rating);
    //TODO updating stars on click
    //TODO live updates for start
    //TODO distinguish between global averages and personal ratings (toggle?)
    return <tr>
        <td>{name}</td>
        <td>{artists}</td>
        <td>{album}</td>
        <td><StarRatingComponent
                name={id}
                starCount={5}
                value={rating}
                onStarClick={root.onStarClick.bind(root)}
                starColor="#1DB954"/>
        </td>
    </tr>
}