import React from 'react';
import {Api} from '../Api';
import {Template} from "../Template";
import {toast} from 'react-toastify';
import Moment from "react-moment";
import Remarkable from "react-remarkable";
import {Loading} from "../utils/Loading";

export class TodoDetail extends React.Component {

    itemDelete = () => {
        let id = this.props.match.params.id;
        let _this = this;
        toast.info("Deleting Todo #" + id);
        Api.get('/todo/delete/' + id + '/', (cb) => {
            if (cb.success) {
                toast.success("Todo #" + id + " deleted");
                _this.props.history.push('/todo/list');
            } else {
                toast.warn("Warning: Deletion unsuccessful");
            }
        }, (err) => {
            toast.error("Error: " + err.responseJSON.detail);
        });
    };
    itemProgress = (progress) => () => {
        let id = this.props.match.params.id;
        let _this = this;
        toast.info("Updating Todo #" + id);
        Api.getData('/todo/progress/' + id + '/', {
            progress: progress
        }, (cb) => {
            if (cb.success) {
                toast.success("Todo #" + id + " updated to " + progress + "%");
                _this.componentDidMount();
            } else {
                toast.warn("Warning: Update unsuccessful");
            }
        }, (err) => {
            toast.error("Error: " + err.responseJSON.detail);
        });
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        let id = this.props.match.params.id;
        let _this = this;
        Api.get('/todo/detail/' + id + '/', (cb) => {
            _this.setState({detail: cb});
        }, (err) => {
            toast.error("Error: " + err.responseJSON.detail);
        });
    }

    render() {
        let item = this.state.detail;
        if (item) {
            let nowDt = new Date();
            let endDt = new Date(item.end);
            let beginDt = new Date(item.begin);
            let timePercent =
                endDt > nowDt ?
                    ((nowDt - beginDt) / (endDt - beginDt) * 100.0).toFixed(2) :
                    beginDt > nowDt ?
                        "0.00" : "100.00";
            return (
                <Template>
                    <h3 className="card-title mb-2">{item.title}</h3>
                    <hr/>
                    <h5 className="card-subtitle mb-2 text-muted">{item.description}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">
                        <Moment format="YYYY-MM-DD HH:mm">{item.begin}</Moment> -
                        <Moment format="YYYY-MM-DD HH:mm">{item.end}</Moment>
                    </h6>
                    <hr/>
                    <div className="button-group">
                        <button onClick={this.itemDelete} className="btn btn-danger"><i className="fa fa-trash"/> Delete
                        </button>
                        <button onClick={this.itemProgress(0)} className="btn btn-warning"><i
                            className="fa fa-star-o"/> Reset Progress
                        </button>
                        <button onClick={this.itemProgress(50)} className="btn btn-primary"><i
                            className="fa fa-star-half-o"/> Set 50%
                        </button>
                        <button onClick={this.itemProgress(100)} className="btn btn-success"><i
                            className="fa fa-star"/> Set Finished
                        </button>
                        <a href={`/todo/edit/${item.id}`} className="btn btn-info"><i
                            className="fa fa-pencil"/> Edit</a>
                    </div>
                    <hr/>
                    <div className="progress" style={{"height": 20}}>
                        <div className="progress-bar" role="progressbar"
                             style={{"width": timePercent + "%", "fontSize": 12}}
                             aria-valuenow={timePercent} aria-valuemin="0"
                             aria-valuemax="100">{timePercent}% Time
                        </div>
                    </div>
                    <br/>
                    <div className="progress" style={{"height": 20}}>
                        <div className="progress-bar bg-success" role="progressbar"
                             style={{"width": item.progress + "%", "fontSize": 12}}
                             aria-valuenow={item.progress} aria-valuemin="0"
                             aria-valuemax="100">{item.progress}% Complete
                        </div>
                    </div>
                    <hr/>
                    <Remarkable>{item.markdown}</Remarkable>
                </Template>
            );
        }
        return <Loading/>;
    }
}
