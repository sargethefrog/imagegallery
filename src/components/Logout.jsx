import React from 'react';
import {Redirect} from "react-router-dom";

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
                console.log('LOGOUT : ', result);
                if(result.result === 'success'){
                    this.setState({loggedOut : true});
                } else {
                    this.setState({loggedOut : false});
                }

            });
    }
    render(){
        if(this.state.loggedOut){
            return (
                <Redirect to="/" />
            );
        }
        //return null;
        return <p>Ошибка выхода с сайта.</p>;
    }
}