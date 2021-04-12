import React from 'react';
export function Header(){
    return (
        <header className="container my-3 pb-3">
            <div className="row">
                <div id="logo" className="col-md-8 mb-3">
                    <a href="index.php">
                        <img src="img/logo.png" />
                            <span>Галерея изображений</span>
                    </a>
                </div>
                <div className="reg_and_auth col-md-4">
                    <a href="reg.php" className="btn ms-2">
                        <i className="fa fa-address-book" aria-hidden="true"></i>
                        <span className="visible-md">Регистрация</span></a>
                    <a href="auth.php" className="btn">
                        <i className="fa fa-sign-in-alt" aria-hidden="true"></i>
                        Вход
                    </a>
                    <span className="mx-2">
            <i className="fas fa-user"></i>
        </span>
                    <a href="php/logout.php" className="btn">
                        <i className="fa fa-sign-out-alt" aria-hidden="true"></i>
                        Выход
                    </a>
                </div>
            </div>
        </header>
    );
}