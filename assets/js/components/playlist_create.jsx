import React from 'react';

export default class PlaylistCreate extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            title: "",
            minStar: 1
        };

        this.changeTitle = this.changeTitle.bind(this);
        this.changeMin = this.changeMin.bind(this);
        this.create = this.create.bind(this);
    }

    changeTitle(ev) {
        this.setState({title: ev.target.value});
    }

    changeMin(ev) {
        this.setState({minStar: ev.target.value});
    }

    create() {
       let title = this.state.title || this.props.titlePlacehold;
       this.props.create(title, this.state.minStar)
    }

    render() {
        return <div className="d-inline">
            <button type="button" className="btn btn-primary mb-3" data-toggle="modal"
                    data-target="#playlistModal">
                create playlist
            </button>

            <div className="modal fade" id="playlistModal" tabIndex="-f1" role="dialog"
                 aria-labelledby="playlistModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content" style={{backgroundColor: "#191414"}}>
                        <div className="modal-header">
                            <h5 className="modal-title" id="playlistModalLabel">Create Playlist</h5>
                            <button type="button" className="close" data-dismiss="modal"
                                    aria-label="Close">
                                <span aria-hidden="true" style={{color: "#FFFFFF"}}>&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={this.create}>
                                <div className="form-group">
                                    <label>Title</label>
                                    <input type="text" className="form-control"
                                           required={true}
                                           placeholder={this.props.titlePlacehold}
                                           value={this.state.title}
                                           onChange={this.changeTitle}/>
                                </div>
                                <div className="form-group">
                                    <label>Minimum rating</label>
                                    <input type="number" className="form-control"
                                           min="1" max="5" step="0.5"
                                           value={this.state.minStar}
                                           onChange={this.changeMin}/>
                                </div>
                                <button type="button" className="btn btn-secondary mr-2"
                                        data-dismiss="modal">
                                    Close
                                </button>
                                <button type="submit" className="btn btn-primary"
                                        data-dismiss="modal"
                                        onClick={this.create}>
                                    Create Playlist</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}