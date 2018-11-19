import React from 'react';
import ReactDOM from 'react-dom';
import { Link, BrowserRouter as Router, Route } from 'react-router-dom';
import axios from 'axios';
import { Provider } from 'react-redux';

import SavedTracks from './components/saved_tracks'

export default function root_init(node, store) {
    ReactDOM.render(
        <Provider store={store}>
            <Root tasks={null} />
        </Provider>, node);
}

class Root extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div>
            <Router>
                <Route path="/" exact={true} render={() =>
                    <SavedTracks />
                } />
            </Router>
        </div>;
    }
}