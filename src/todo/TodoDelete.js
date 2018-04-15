import React from 'react';
import {Api} from '../Api';
import {Template} from "../Template";

export class TodoDelete extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        let id = this.props.match.params.id;
        let data = 'deleting...';
        Api.get('/todo/delete/' + id + '/', (cb) => {
            console.log("cb", cb);
            if (cb.success) {
                this.props.history.push('/todo/list');
            } else {
                console.log(cb);
                data = 'delete failed';
            }
        }, (cbe) => {
            console.log("cbe", cbe);
            console.log("cbed", cbe.detail);
            this.state.data = cbe.detail;
        });
        return (
            <Template>
                <div style={{"text-align": "center"}}>
                    <div className="loader">
                    </div>
                    <p>{this.state ? this.state.data : ""}</p>
                </div>
            </Template>
        );
    }

}
