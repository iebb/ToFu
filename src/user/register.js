import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from "react-router-dom";
import {Api} from '../Api';
import {Template} from '../Template';
import {toast} from "react-toastify";

export class Register extends React.Component {

    constructor(props) {
        super(props);
        this.state = {value: ''};

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();

        let username = this.refs.username.value;
        let password = this.refs.password.value;
        let firstname = this.refs.firstname.value;
        let lastname = this.refs.lastname.value;
        let email = this.refs.email.value;
        let _this = this;

        Api.createUser({
            username: username,
            password: password,
            first_name: firstname,
            last_name: lastname,
            email: email,
        }, (cb) => {
            if (cb.success) {
                toast.success("Nice! Account Created");
                _this.props.history.push('/user/login');
            } else {
                toast.warn("Warning: Deletion unsuccessful");
            }
        }, (err) => {
            toast.error("Error: " + err.responseJSON.detail);
        });
    }

    render() {
        return (
            <Template>
                <div className="container">
                    <form className="form" onSubmit={this.handleSubmit}>
                        <fieldset>
                            <legend>Register</legend>
                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <input required type="text" className="form-control" id="username" ref="username"
                                       placeholder="ieb"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input required type="password" className="form-control" id="password" ref="password"
                                       placeholder="sOmEr4Nd@MPa5sw0r6"/>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label htmlFor="firstname">First Name</label>
                                    <input required type="text" className="form-control" id="firstname"
                                           ref="firstname"/>
                                </div>
                                <div className="form-group col-md-6">
                                    <label htmlFor="lastname">Last Name</label>
                                    <input required type="text" className="form-control" id="lastname" ref="lastname"/>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-12">
                                    <label htmlFor="email">E-mail</label>
                                    <input required type="email" className="form-control" id="email" ref="email"/>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary" name="submit">Submit</button>
                        </fieldset>
                    </form>
                </div>
            </Template>
        );
    }
}

Register.contextTypes = {
    router: function () {
        PropTypes.func.isRequired
    }
};

export default withRouter(Register);