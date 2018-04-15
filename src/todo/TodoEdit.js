import React from 'react';
import {Api} from '../Api';
import {Template} from "../Template";
import DateTime from 'react-datetime';
import {toast} from 'react-toastify';
import {Loading} from "../utils/Loading";

export class TodoEdit extends React.Component {

    handleChange = (key) => (newDate) => {
        if (newDate !== 'Invalid date') {
            console.log(key, newDate.toISOString());
            this.setState({
                [key]: newDate.toISOString(),
            });
        }
    };

    constructor(props) {
        super(props);
        this.state = {value: ''};
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleSubmit(event) {
        let id = this.props.match.params.id;
        event.preventDefault();
        Api.post('/todo/edit/' + id + '/', {
            "begin": this.state["dateBegin"] || new Date(this.state.detail.begin).toISOString(),
            "end": this.state["dateEnd"] || new Date(this.state.detail.end).toISOString(),
            "title": this.refs.title.value,
            "description": this.refs.description.value,
            "progress": this.refs.progress.value,
            "markdown": this.refs.markdown.value,
            "priority": this.refs.priority.value,
        }, (cb) => {
            if (cb.success) {
                toast.success("Todo created");
                this.props.history.push('/todo/detail/' + id + '/');
            } else {
                cb.details.forEach(function (item) {
                    item.forEach(function (element) {
                        toast.error(item.replace('_', ' ') + ": " + element);
                    });
                })
            }
        }, (err) => {
            toast.error("Error: " + err.responseJSON.detail);
        })

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
            return (
                <Template>
                    <div className="container">
                        <form className="form" onSubmit={this.handleSubmit}>
                            <fieldset>
                                <legend>Edit Todo</legend>
                                <div className="form-row">
                                    <div className="form-group col-md-12">
                                        <label htmlFor="title">Title</label>
                                        <input required type="text" className="form-control" id="title" ref="title"
                                               defaultValue={item.title}/>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group col-md-12">
                                        <label htmlFor="description">Description</label>
                                        <input required type="text" className="form-control" id="description"
                                               ref="description"
                                               defaultValue={item.description}/>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group col-md-6">
                                        <label htmlFor="picker1">Begin</label>
                                        <DateTime id="picker1" onChange={this.handleChange('dateBegin')}
                                                  defaultValue={new Date(item.begin)}/>
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label htmlFor="picker2">End</label>
                                        <DateTime id="picker2" onChange={this.handleChange('dateEnd')}
                                                  defaultValue={new Date(item.end)}/>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group col-md-6">
                                        <label htmlFor="priority">Priority (Lower = More important)</label>
                                        <input required type="text" className="form-control" id="priority"
                                               ref="priority"
                                               defaultValue={item.priority}/>
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label htmlFor="progress">Current Progress (%)</label>
                                        <input required type="text" className="form-control" id="progress"
                                               ref="progress"
                                               defaultValue={item.progress}/>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group col-md-12">
                                        <label htmlFor="markdown">Markdown</label>
                                        <textarea className="form-control" id="markdown" ref="markdown"
                                                  defaultValue={item.markdown}/>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary" name="submit">Update Todo</button>
                                <a href={`/todo/detail/${item.id}`} className="btn btn-info"><i
                                    className="fa fa-info"/> Back to details</a>
                            </fieldset>
                        </form>
                    </div>
                </Template>
            );
        }
        return <Loading/>;
    }
}
