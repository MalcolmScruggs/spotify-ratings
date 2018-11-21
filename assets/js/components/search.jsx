import React from 'react';

import TrackList from './tracks/track_list'

export default class Search extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            query: "",
            searched: false
        };

        this.socket = props.socket;
        this.changeQuery = this.changeQuery.bind(this);
        this.onSearch = this.onSearch.bind(this);
    }

    changeQuery(ev) {
        this.setState({query: ev.target.value});
    }

    onSearch() {
        this.setState({searched: true})
    }

    render() {
        if (this.state.searched) {
            return <TrackList
                socket={this.socket}
                user_id={window.userId}
                api_url="/api/v1/search"
                title={"Search Results: " + this.state.query}
                isSearch={true}
                query={this.state.query}
            />
        } else {
            return <div>
                <form className="form-inline" onSubmit={this.onSearch}>
                    <input type="text" className="form-control mr-2"
                           value={this.state.query}
                           placeholder="search"
                           onChange={this.changeQuery}
                           />
                    <button type="submit" className="btn btn-primary" onClick={this.onSearch}>search</button>
                </form>
            </div>
        }
    }
}