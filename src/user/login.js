import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from "react-router-dom";
import {Api} from '../Api';
import {Template} from '../Template';
import {toast} from "react-toastify";

export class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {value: ''};
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();

        let username = this.refs.username.value;
        let password = this.refs.password.value;

        Api.login(username, password, (loggedIn) => {
            if (loggedIn) {
                this.props.history.replace('/');
            }
        }, (cbe) => {
            let rej = cbe.responseJSON;
            rej.forEach(function (item) {
                item.forEach(function (err) {
                    toast.error(err);
                });
            });
        })
    }

    render() {
        return (
            <Template>
                <div className="container">
                    <p>
                        <a href="/user/register">Register here</a> if you don't have an account.
                    </p>
                    <form className="form" onSubmit={this.handleSubmit}>
                        <fieldset>
                            <legend>Log in</legend>
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
                            <button type="submit" className="btn btn-primary" name="submit">Login</button>
                        </fieldset>
                    </form>
                </div>
            </Template>
        );
    }
}

Login.contextTypes = {
    router: function () {
        PropTypes.func.isRequired
    }
};

export default withRouter(Login);