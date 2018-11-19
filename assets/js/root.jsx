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
                <div>
                    <Route path="/" exact={true} render={() =>
                        <SavedTracks socket={this.socket} />
                    } />
                    <Route path="test" exact={true} render={ () =>
                        <SavedTracks socket={this.socket} />
                    } />
                </div>
            </Router>
        </div>;
    }
}