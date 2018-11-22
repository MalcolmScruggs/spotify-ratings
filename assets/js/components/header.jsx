import React from 'react';
import { NavLink } from 'react-router-dom';


export default function Header(props) {
    return <nav className="navbar navbar-expand-md navbar-dark p-0 pb-3 pt-1">
        <a className="navbar-brand" href="#">Spotify Ratings</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav">
                <li className="nav-item">
                    <NavLink exact to="/top_rated" className="nav-link" activeClassName="active">Top Rated</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink exact to="/saved" className="nav-link" activeClassName="active">Saved</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink exact to="/my_song_ratings" className="nav-link" activeClassName="active">My Ratings</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink exact to="/search" className="nav-link" activeClassName="active">Search</NavLink>
                </li>
            </ul>
        </div>
    </nav>
}