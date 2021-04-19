import React from 'react';

export class Logout extends React.Component{

    constructor() {
        super();
        this.state = {};
    }

    componentDidMount(){
        fetch('http://y91756wn.beget.tech/imagegallery/php/handlerLogout.php',{
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