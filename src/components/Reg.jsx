import React from 'react';
import {Redirect} from "react-router-dom";

export class Reg extends React.Component{

    constructor() {
        super();
        this.state = {};
        this.handlerSubmit = this.handlerSubmit.bind(this);
    }

    handlerSubmit(e){
        e.preventDefault();
        const formData = new FormData(e.target);
        fetch('http://y91756wn.beget.tech/imagegallery/php/handlerReg.php',{
            method : 'POST',
            body : formData
        }).then(response => response.json())
            .then(result => {
                if(result.result === 'success'){
                    this.setState({info : <Redirect to="/auth" />});
                } else {
                    this.setState({info : <div id="info" className="error">Ошибка регистрации.</div>});
                }
            });
    }

    render(){
        return (
            <div className="container">
                <h1 className="text-center">Регистрация</h1>
                {this.state.info}
                <form id="regForm" onSubmit={this.handlerSubmit}>
                    <input type="text" name="name" className="form-control my-3" placeholder="Имя" required />
                        <input type="text" name="email" className="form-control my-3" placeholder="E-mail" required />
                            <input type="password" name="pass" className="form-control my-3" placeholder="Пароль"
                                   required />
                                <input type="submit" name="reg_submit" className="form-control btn btn-primary my-3"
                                       value="Зарегистрироваться" />
                </form>
            </div>
        );
    }
}