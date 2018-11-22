import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'


import TrackList from './components/tracks/track_list'
import Search from './components/search'
import Header from './components/header'

export default function root_init(node, store, socket) {
    const options = {
        position: 'bottom center',
        timeout: 3000,
        offset: '100px',
        transition: 'scale'
    };

    ReactDOM.render(
        <AlertProvider template={AlertTemplate} {...options}>
            <Root socket={socket} />
        </AlertProvider>, node);
}

class Root extends React.Component {
    constructor(props) {
        super(props);

        this.socket = props.socket;
    }

    render() {
        return <div>
            <Router>
                <div className="container px-sm-0">
                    <Header />
                    <div>
                        <Route path="/saved" exact={true} render={() =>
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
                                isPrivate={true}
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
                        <Route path="/search" render={ () =>
                            <Search socket={this.socket} />
                        }/>
                    </div>
                </div>
            </Router>
        </div>;
    }
}