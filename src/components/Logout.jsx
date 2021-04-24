import React from 'react';
import {host} from "../config";

export class Logout extends React.Component{

    constructor() {
        super();
        this.state = {};
    }

    componentDidMount(){
        fetch(host + '/handlerLogout',{
            credentials : "include"
        })
            .then(response => response.json())
            .then(result => {
                window.history.back();

            });
    }
    render(){
        return null;
    }
}