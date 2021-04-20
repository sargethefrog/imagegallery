import React from 'react';
import {Header} from "./Header";
import {host} from "../config";

export class Auth extends React.Component{

    constructor() {
        super();
        this.state = {};
        this.handlerSubmit = this.handlerSubmit.bind(this);
    }

    handlerSubmit(e){
        e.preventDefault();
        const formData = new FormData(e.target);
        fetch(host + '/php/handlerAuth.php',{
            method : 'POST',
            body : formData,
            credentials : "include"
        }).then(response => response.json())
            .then(result => {
                if(result.result === 'success'){
                    window.history.back();
                } else {
                    this.setState({info : <div id="info" className="error">Неверный логин и / или пароль.</div>})
                }
            });
    }

    render(){
        return (
            <>
                <Header />
                <div className="container">
                    <h1 className="text-center">Авторизация</h1>
                    {this.state.info}
                    <form id="authForm" onSubmit={this.handlerSubmit}>
                        <input type="text" name="email" className="form-control my-3" placeholder="E-mail" required />
                            <input type="password" name="pass" className="form-control my-3" placeholder="Пароль" required />
                                <input type="submit" name="auth_submit" className="form-control btn btn-primary my-3"
                                       value="Вход" />
                    </form>
                </div>
            </>
        );
    }
}