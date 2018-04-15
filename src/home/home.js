import React from 'react';
import {Link} from 'react-router-dom';
import {Api} from '../Api';
import Moment from 'react-moment';
import {Template} from "../Template";
import {Loading} from "../utils/Loading";

export class Home extends React.Component {
    static renderItem = (_this) => (item) => {
        let nowDt = new Date();
        let endDt = new Date(item.end);
        let beginDt = new Date(item.begin);
        let timePercent =
            endDt > nowDt ?
                ((nowDt - beginDt) / (endDt - beginDt) * 100.0).toFixed(2) :
                beginDt > nowDt ?
                    "0.00" : "100.00";
        return (
            <div className="col-12 col-sm-6 col-lg-4" key={item.id}>
                <div className="card mb-3">
                    <div className="card-body">
                        <a className="close" href={`/todo/edit/${item.id}`} style={{"marginRight": 5}}>
                            <span className="fa fa-pencil" aria-hidden="true" style={{'fontSize': '75%'}}
                                  data-id={item.id}/>
                        </a>
                        <Link to={`/todo/detail/${item.id}`}>
                            <h4 className="card-title">{item.title}</h4>
                        </Link>
                        <h6 className="card-subtitle mb-2 text-muted">#{item.id}</h6>
                        <h6 className="card-subtitle mb-2 text-muted">
                            <i className="fa fa-plus-circle" aria-hidden="true"/> <Moment
                            fromNow>{item.created}</Moment>
                        </h6>
                        <h6 className="card-subtitle mb-2 text-muted">
                            <i className="fa fa-pencil" aria-hidden="true"/> <Moment fromNow>{item.modified}</Moment>
                        </h6>
                        <h6 className="card-subtitle mb-2 text-muted ellipsis">{item.description}</h6>
                        <h6 className="card-subtitle mb-2 text-muted ellipsis">
                            <Moment format="YY-MM-DD HH:mm">{item.begin}</Moment> - <Moment
                            format="YY-MM-DD HH:mm">{item.end}</Moment>
                        </h6>
                        <div className="card-text">
                            <div className="progress" style={{"height": 20}}>
                                <div className="progress-bar" role="progressbar"
                                     style={{"width": timePercent + "%", "fontSize": 12}}
                                     aria-valuenow={timePercent} aria-valuemin="0"
                                     aria-valuemax="100">{timePercent}% Time
                                </div>
                            </div>
                            <div className="progress" style={{"height": 20}}>
                                <div className="progress-bar bg-success" role="progressbar"
                                     style={{"width": item.progress + "%", "fontSize": 12}}
                                     aria-valuenow={item.progress} aria-valuemin="0"
                                     aria-valuemax="100">{item.progress}% Complete
                                </div>
                            </div>
                        </div>
                        <p className="card-text">{item.comment}</p>

                    </div>
                </div>
            </div>
        );
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        let home = this;
        Api.get("/todo/summary/", function (data) {
            home.setState({data: data});
        });
    }

    render() {
        if (!Api.loggedIn()) {
            this.props.history.replace('/user/login');
        } else {
            if (this.state && this.state.data) {
                let name = this.state.data.name;
                let todo_count = this.state.data.todo_count;
                return (
                    <Template>
                        <section className="jumbotron text-center">
                            <div className="container">
                                <h1 className="jumbotron-heading">Hello, {name}</h1>
                                {
                                    todo_count ? (
                                        <div>
                                            <p className="lead text-muted">
                                                You have {todo_count} Todos Working in Progress. <br/>
                                                Here are your most urgent WIP Todos. <br/>
                                                Alternatively, see the full list or create a new one here.</p>
                                            <div className="button-group">
                                                <a href="/todo/list/wip" className="btn btn-primary">WIP</a>
                                                <a href="/todo/list/done" className="btn btn-success">Done</a>
                                                <a href="/todo/list/all" className="btn btn-warning">All</a>
                                                <a href="/todo/add" className="btn btn-secondary">New Todo</a>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <p className="lead text-muted">
                                                Congrats! You have no unfinished Todos now. <br/>
                                                Create a new one here!
                                            </p>
                                            <div className="button-group">
                                                <a href="/todo/add" className="btn btn-secondary">New Todo</a>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </section>
                        <div className="row">
                            {
                                this.state.data.todos.map(Home.renderItem(this))
                            }
                        </div>
                    </Template>
                );
            }
        }
        return <Loading/>;
    }
}