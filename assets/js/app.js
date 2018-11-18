// We need to import the CSS so that webpack will load it.
// The MiniCssExtractPlugin is used to separate it out into
// its own CSS file.
import css from "../css/app.scss"

// webpack automatically bundles all modules in your
// entry points. Those entry points can be configured
// in "webpack.config.js".
//
// Import dependencies
//
import "phoenix_html"

import jQuery from 'jquery';
window.jQuery = window.$ = jQuery; // Bootstrap requires a global "$" object.
import "bootstrap";
import axios from 'axios';

// Import local files
//
// Local files can be imported directly using relative paths, for example:
// import socket from "./socket"
$(function () {
    $('.rating-button').click((ev) => {
        let user_id = $(ev.target).data('user-id');
        let track_id = $(ev.target).data('track-id');
        let rating = $(`#rating-${track_id}`).val();

        let data = {
                user_id: user_id,
                song_id: track_id,
                stars: rating
        };
        axios.post('/api/v1/song_ratings', {
            song_rating: data
        }).then((resp) => {
            alert(resp);
            console.log(resp);
        })

        //$.ajax("/api/v1/song_ratings", {
        //    method: "post",
        //    dataType: "json",
        //    contentType: "application/json; charset=UTF-8",
        //    data: data,
        //    success: (resp) => {
        //        alert(resp);
        //    }
        //});
    });
});