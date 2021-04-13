import React from 'react';
import {Link} from "react-router-dom";
export function Header(){
    return (
        <header className="container my-3 pb-3">
            <div className="row">
                <div id="logo" className="col-md-8 mb-3">
                    <Link to="/">
                        <img src="img/logo.png" />
                            <span>Галерея изображений</span>
                    </Link>
                </div>
                <div className="reg_and_auth col-md-4">
                    <Link to="/reg" className="btn ms-2">
                        <i className="fa fa-address-book" aria-hidden="true"></i>
                        <span className="visible-md">Регистрация</span></Link>
                    <Link to="/auth" className="btn">
                        <i className="fa fa-sign-in-alt" aria-hidden="true"></i>
                        Вход
                    </Link>
                    <span className="mx-2">
            <i className="fas fa-user"></i>
        </span>
                    <a href="/logout" className="btn">
                        <i className="fa fa-sign-out-alt" aria-hidden="true"></i>
                        Выход
                    </a>
                </div>
            </div>
        </header>
    );
}