import React from 'react';
import {withRouter} from "react-router-dom";
import {Api} from '../Api';

export class Logout extends React.Component {

    constructor(props) {
        super(props);
        Api.logout();
        this.props.history.replace('/');
    }

    render() {
        return (
            <div>
            </div>
        );
    }
}

export default withRouter(Logout);