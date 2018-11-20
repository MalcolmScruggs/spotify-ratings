import React from 'react';
import ReactDOM from 'react-dom';
import { Link, BrowserRouter as Router, Route } from 'react-router-dom';
import axios from 'axios';
import { Provider } from 'react-redux';

import SavedTracks from './components/saved_tracks'

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
    }

    render() {
        return <div>
            <Router>
                <div className="container">
                    <Route path="/" exact={true} render={() =>
                        <SavedTracks socket={this.socket} api_url="/api/v1/saved_songs" />
                    } />
                    <Route path="/my_song_ratings" exact={true} render={ () =>
                        <SavedTracks socket={this.socket} api_url="/api/v1/my_song_ratings" />
                    } />
                </div>
            </Router>
        </div>;
    }
}