import React from 'react';
import {Api} from '../Api';
import {Template} from '../Template';
import DateTime from 'react-datetime';
import {toast} from 'react-toastify';

export class TodoAdd extends React.Component {

    handleChange = (key) => (newDate) => {
        if (newDate !== 'Invalid date') {
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
        event.preventDefault();
        Api.post('/todo/add/', {
            "begin": this.state["dateBegin"],
            "end": this.state["dateEnd"],
            "title": this.refs.title.value,
            "description": this.refs.description.value,
            "progress": this.refs.progress.value,
            "markdown": this.refs.markdown.value,
            "priority": this.refs.priority.value,
        }, (cb) => {
            if (cb.success) {
                toast.success("Todo created");
                this.props.history.push('/todo/list/');
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
    }

    render() {
        return (
            <Template>
                <div className="container">
                    <form className="form" onSubmit={this.handleSubmit}>
                        <fieldset>
                            <legend>New Todo</legend>
                            <div className="form-row">
                                <div className="form-group col-md-12">
                                    <label htmlFor="title">Title</label>
                                    <input required type="text" className="form-control" id="title" ref="title"
                                           placeholder="My New Todo"/>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-12">
                                    <label htmlFor="description">Description</label>
                                    <input required type="text" className="form-control" id="description"
                                           ref="description"
                                           placeholder="Finish project [name]"/>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label htmlFor="picker1">Begin</label>
                                    <DateTime id="picker1" onChange={this.handleChange('dateBegin')}/>
                                </div>
                                <div className="form-group col-md-6">
                                    <label htmlFor="picker2">End</label>
                                    <DateTime id="picker2" onChange={this.handleChange('dateEnd')}/>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label htmlFor="priority">Priority (Lower = More important)</label>
                                    <input required type="text" className="form-control" id="priority" ref="priority"
                                           defaultValue="10"/>
                                </div>
                                <div className="form-group col-md-6">
                                    <label htmlFor="progress">Current Progress (%)</label>
                                    <input required type="text" className="form-control" id="progress" ref="progress"
                                           defaultValue="0"/>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-12">
                                    <label htmlFor="markdown">Markdown</label>
                                    <textarea className="form-control" id="markdown" ref="markdown"/>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary" name="submit">Add Todo</button>
                        </fieldset>
                    </form>
                </div>

            </Template>
        );
    }
}
