import React from 'react';
import StarRatingComponent from 'react-star-rating-component';

export default function Song(props) {
    let {song, root} = props;
    let {album, artists, id, name} = song;
    let rating = round(song.rating, 4);
    return <tr>
        <td className="text-truncate" style={{maxWidth: "1px"}}>{name}</td>
        <td className="text-truncate" style={{maxWidth: "1px"}}>{artists}</td>
        <td className="text-truncate" style={{maxWidth: "1px"}}>{album}</td>
        <td data-toggle="tooltip" data-placement="top" title={rating || "unrated"}>
            <StarRatingComponent
                name={id}
                starCount={5}
                value={rating}
                onStarClick={root.onStarClick.bind(root)}
                starColor="#1DB954"
            />
        </td>
    </tr>
}

//http://www.jacklmoore.com/notes/rounding-in-javascript/
function round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}