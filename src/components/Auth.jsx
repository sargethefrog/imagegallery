import React from 'react';

export class Auth extends React.Component{
    render(){
        return (
            <div className="container">
                <h1 className="text-center">Авторизация</h1>
                <form id="authForm">
                    <input type="text" name="email" className="form-control my-3" placeholder="E-mail" required />
                        <input type="password" name="pass" className="form-control my-3" placeholder="Пароль" required />
                            <input type="submit" name="auth_submit" className="form-control btn btn-primary my-3"
                                   value="Вход" />
                </form>
            </div>
        );
    }
}