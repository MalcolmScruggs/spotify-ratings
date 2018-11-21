import React from 'react';
import ReactDOM from 'react-dom';
import { Link, BrowserRouter as Router, Route } from 'react-router-dom';
import axios from 'axios';
import { Provider } from 'react-redux';

import TrackList from './components/tracks/track_list'

export default function root_init(node, store, socket) {
    ReactDOM.render(
        <Provider store={store}>
            <Root socket={socket} />
        </Provider>, node);
}

class Root extends React.Component {
    constructor(props) {
        super(props);

        this.socket = props.socket;
        console.log(window.userId);
    }

    render() {
        return <div>
            <Router>
                <div>
                    <Header />
                    {/*TODO make a home landing page*/}
                    <div className="container px-sm-0">
                        <Route path="/" exact={true} render={() =>
                            <TrackList
                                socket={this.socket}
                                user_id={window.userId}
                                api_url="/api/v1/song/my_saved"
                                title="Saved Songs"
                            />
                        } />
                        <Route path="/my_song_ratings" exact={true} render={ () =>
                            <TrackList
                                socket={this.socket}
                                user_id={window.userId}
                                api_url="/api/v1/song/my_ratings"
                                title="Rated Songs"
                            />
                        } />
                        <Route path="/top_rated" exact={true} render={ () =>
                            <TrackList
                                socket={this.socket}
                                user_id={window.userId}
                                api_url="/api/v1/song/top_rated"
                                title="Global Top Rated Songs"
                            />
                        } />
                    </div>
                </div>
            </Router>
        </div>;
    }
}

function Header(props) {
    //logout
    //authenticate
    //TODO make its own component
    return <nav className="navbar navbar-expand-md navbar-dark bg-dark">
        <a className="navbar-brand" href="#">Navbar</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav">
                <li className="nav-item active">
                    <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="#">Features</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="#">Pricing</a>
                </li>
                <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Dropdown link
                    </a>
                    <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                        <a className="dropdown-item" href="#">Action</a>
                        <a className="dropdown-item" href="#">Another action</a>
                        <a className="dropdown-item" href="#">Something else here</a>
                    </div>
                </li>
            </ul>
        </div>
    </nav>
}