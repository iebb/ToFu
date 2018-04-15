import React from 'react';
import {Link} from 'react-router-dom';
import {Api} from '../Api';
import Moment from 'react-moment';
import {Template} from "../Template";
import {toast} from 'react-toastify';
import {Loading} from "../utils/Loading";
import ReactPaginate from 'react-paginate';

export class TodoList extends React.Component {
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
                        {
                            item.progress < 100 ?
                                <a className="close" onClick={_this.itemProgress(100)} title="Set Finished">
                                    <span className="fa fa-check" aria-hidden="true" style={{'fontSize': '75%'}}
                                          data-id={item.id}/>
                                </a> :
                                <a className="close" onClick={_this.itemProgress(0)} title="Reset Progress">
                                    <span className="fa fa-refresh" aria-hidden="true" style={{'fontSize': '75%'}}
                                          data-id={item.id}/>
                                </a>

                        }
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
    itemProgress = (progress) => (e) => {
        let _this = this;
        let id = e.target.getAttribute('data-id');
        console.log(_this);
        toast.info("Modifying Todo #" + id);
        Api.getData('/todo/progress/' + id + '/', {
            progress: progress
        }, (cb) => {
            if (cb.success) {
                toast.success("Todo #" + id + " updated to " + progress + "%");
                Api.getData("/todo/list/", _this.requestData(),
                    function (data) {
                        _this.setState({data: data});
                    });
            } else {
                toast.warn("Warning: Modification unsuccessful");
            }
        }, (err) => {
            toast.error("Error: " + err.responseJSON.detail);
        });
    };
    handlePageClick = (data) => {
        let _this = this;
        let selected = data.selected;
        this.setState({page: selected}, function () {
            Api.getData("/todo/list/", _this.requestData(),
                function (data) {
                    _this.setState({data: data});
                });
        });
    };

    changeResultPerRow = (num) => () => {
        let _this = this;
        this.setState({limit: num, loaded: false}, function () {
            Api.getData("/todo/list/", _this.requestData(),
                function (data) {
                    _this.setState({data: data, loaded: true});
                });
        });
    };

    constructor(props) {
        super(props);
        this.state = {
            page: this.props.match.params.page || 0,
            order: this.props.match.params.order || "weight",
            filter: this.props.match.params.filter || "wip",
            loaded: false,
            limit: 6
        };
    }

    requestData() {
        return {
            filter: this.state.filter,
            order: this.state.order,
            page: this.state.page,
            limit: this.state.limit
        }
    }

    componentDidMount() {
        let _this = this;
        this.setState({
            page: this.props.match.params.page || 0,
            order: this.props.match.params.order || "weight",
            filter: this.props.match.params.filter || "wip",
            loaded: false
        }, function () {
            Api.getData("/todo/list/", _this.requestData(),
                function (data) {
                    _this.setState({data: data, loaded: true});
                });
        });
    }

    componentWillReceiveProps(nextProps) {
        let _this = this;
        this.setState({
            page: nextProps.match.params.page || 0,
            order: nextProps.match.params.order || "weight",
            filter: nextProps.match.params.filter || "wip",
            loaded: false
        }, function () {
            Api.getData("/todo/list/", _this.requestData(),
                function (data) {
                    _this.setState({data: data, loaded: true});
                });
        });
    }

    render() {
        if (!Api.loggedIn()) {
            this.props.history.replace('/user/login');
        } else {
            let orders = {
                'weight': 'Weight',
                'priority': 'Priority',
                'end': 'End',
                'begin': 'Begin',
                'created': 'Creation',
                'modified': 'Edit',
            };
            let filters = {
                'wip': 'WIP',
                'done': 'Done',
                'all': 'All',
            };
            let rpps = [3, 6, 9, 12, 18];

            if (this.state) {

                let _orders = [];
                for (let order in orders) {
                    _orders.push(<Link to={`/todo/list/${this.state.filter}/${order}`} key={order}
                                       className={`btn btn-${order === this.state.order ? "primary" : "secondary"}`}>{orders[order]}</Link>);
                }
                let _filters = [];
                for (let filter in filters) {
                    _filters.push(<Link to={`/todo/list/${filter}/${this.state.order}`} key={filter}
                                        className={`btn btn-${filter === this.state.filter ? "primary" : "secondary"}`}>{filters[filter]}</Link>);
                }
                let _rpps = [];
                for (let rpp in rpps) {
                    _rpps.push(<button className={`btn btn-${rpps[rpp] === this.state.limit ? "primary" : "secondary"}`}
                                       onClick={this.changeResultPerRow(rpps[rpp])} key={rpp}>{rpps[rpp]}</button>);
                }
                return this.state && this.state.loaded && this.state.data ? (
                    <Template>
                        <div className="row">

                            <div className="col-12 col-md-6">
                                Sort by
                                <div className="button-group">
                                    {_orders}
                                </div>
                            </div>

                            <div className="col-12 col-sm-6 col-md-3">
                                Results/Page
                                <div className="button-group">
                                    {_rpps}
                                </div>
                            </div>

                            <div className="col-12 col-sm-6 col-md-3">
                                Filter
                                <div className="button-group">
                                    {_filters}
                                </div>
                            </div>
                        </div>
                        <hr/>
                        <div className="row">
                            <div className="col-12">
                                <ReactPaginate previousLabel={"«"}
                                               nextLabel={"»"}
                                               breakLabel={<a href="">...</a>}
                                               breakClassName={"break-me"}
                                               pageCount={this.state.data.pages}
                                               marginPagesDisplayed={2}
                                               pageRangeDisplayed={5}
                                               onPageChange={this.handlePageClick}
                                               containerClassName={"pagination"}
                                               previousClassName={"page-item"}
                                               nextClassName={"page-item"}
                                               pageClassName={"page-item"}
                                               pageLinkClassName={"page-link"}
                                               previousLinkClassName={"page-link"}
                                               nextLinkClassName={"page-link"}
                                               activeClassName={"active"}/>
                            </div>
                        </div>
                        <br/>
                        <div className="container-fluid content-row">
                            <div className="row">
                                {
                                    this.state.data.data.map(TodoList.renderItem(this))
                                }
                            </div>
                        </div>
                    </Template>
                ) : <Loading/>;
            } else {
                return <Loading/>;
            }
        }
        return <Loading/>;
    }
}