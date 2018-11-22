import React from 'react';
import ReactDOM from 'react-dom';
import { Link, NavLink, BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'


import TrackList from './components/tracks/track_list'
import Search from './components/search'

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
                    {/*TODO make a home landing page*/}
                    <div>
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

function Header(props) {
    //TODO logout
    //TODO make its own component
    return <nav className="navbar navbar-expand-md navbar-dark p-0 pb-3 pt-1">
        <a className="navbar-brand" href="#">Spotify Ratings</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav">
                <li className="nav-item">
                    <NavLink exact to="/" className="nav-link" activeClassName="active">Home</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink exact to="/top_rated" className="nav-link" activeClassName="active">Top Rated</NavLink>
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