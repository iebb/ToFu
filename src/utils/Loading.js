import React from 'react';
import {Template} from "../Template";

export class Loading extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <Template>
                <div>
                    <div className="loader">
                    </div>
                </div>
            </Template>
        );
    }

}
