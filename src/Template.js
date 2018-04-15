import React from 'react';
import {Api} from './Api';
import {NavLink} from 'react-router-dom';
import './utils/styles.css';
import {ToastContainer} from 'react-toastify';

export class Template extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div>
                <ToastContainer/>
                <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                    <a className="navbar-brand" href="/">MyTodo.TECH</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor01"
                            aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    {
                        Api.loggedIn() ?
                            <div className="collapse navbar-collapse" id="navbarColor01">
                                <ul className="navbar-nav mr-auto">
                                    <li className="nav-item">
                                        <NavLink className="nav-link" to="/todo/list" activeClassName="active">All
                                            Todos</NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink className="nav-link" to="/todo/add" activeClassName="active">New
                                            Todo</NavLink>
                                    </li>
                                </ul>
                                <ul className="navbar-nav">
                                    <li className="nav-item dropdown">
                                        <a className="nav-link dropdown-toggle" id="navbarDropdown" role="button"
                                           data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            {Api.user().user.name}
                                        </a>
                                        <div className="dropdown-menu dropdown-menu-right"
                                             aria-labelledby="navbarDropdown">
                                            <a className="dropdown-item" href="/user/logout/">Logout</a>
                                            <div className="dropdown-divider"/>
                                        </div>
                                    </li>
                                </ul>
                            </div> :
                            <div className="collapse navbar-collapse" id="navbarColor01">
                                <ul className="navbar-nav mr-auto">
                                    <li className="nav-item active">
                                        <a className="nav-link" href="/user/login/">Login</a>
                                    </li>
                                </ul>
                            </div>
                    }
                </nav>
                <div className="container">
                    {this.props.children}
                </div>
            </div>
        );
    }
}