import React from 'react';
import {Link} from "react-router-dom";

/*function AuthPanel(props){
    if(props.loggedIn) return (
        <div className="reg_and_auth col-md-4">
            <span className="mx-2">
            <i className="fas fa-user"></i>{props.user}
        </span>
            <Link to="/logout" className="btn">
                <i className="fa fa-sign-out-alt" aria-hidden="true"></i>
                Выход
            </Link>
        </div>
    ); else return (
        <div className="reg_and_auth col-md-4">
            <Link to="/reg" className="btn ms-2">
                <i className="fa fa-address-book" aria-hidden="true"></i>
                <span className="visible-md">Регистрация</span></Link>
            <Link to="/auth" className="btn">
                <i className="fa fa-sign-in-alt" aria-hidden="true"></i>
                Вход
            </Link>
        </div>
    );
}*/

class AuthPanel extends React.Component{

    constructor() {
        super();
        this.state = {};
    }
    componentDidMount(){
        fetch('http://y91756wn.beget.tech/imagegallery/php/getUser.php',{
            credentials : 'include'
        }).then(response => response.json())
            .then(result => {
                if(result.result === 'error'){
                    this.setState({loggedIn : false});
                } else {
                    this.setState({
                        loggedIn : true,
                        id : result.id,
                        email : result.email,
                        pass : result.pass,
                        name : result.name
                    });
                }
            });
    }
    render(){
        //alert('Header render!');
        if(this.state.loggedIn) return (
            <div className="reg_and_auth col-md-4">
            <span className="mx-2">
            <i className="fas fa-user"></i>{this.state.name}
        </span>
                <Link to="/logout" className="btn">
                    <i className="fa fa-sign-out-alt" aria-hidden="true"></i>
                    Выход
                </Link>
            </div>
        ); else return (
            <div className="reg_and_auth col-md-4">
                <Link to="/reg" className="btn ms-2">
                    <i className="fa fa-address-book me-1" aria-hidden="true"></i>
                    <span className="visible-md">Регистрация</span></Link>
                <Link to="/auth" className="btn ms-1">
                    <i className="fa fa-sign-in-alt me-1" aria-hidden="true"></i>
                    Вход
                </Link>
            </div>
        );
    }
}

export class Header extends React.Component{

    constructor() {
        super();
        this.state = {};
        this.state.name = '';
    }

    componentDidMount(){
        fetch('http://y91756wn.beget.tech/imagegallery/php/getUser.php')
            .then(response => response.json())
            .then(result => {
                if(result.result != 'error'){
                    this.setState({
                        loggedIn : true,
                        userId : result.id,
                        name : result.name,
                        email : result.email
                    });
                }

            });
    }

    logout(){
        fetch('http://y91756wn.beget.tech/imagegallery/php/handlerLogout.php')
            .then(response => response.json())
            .then(result => {
                if(result.result === 'success'){
                    this.setState({loggedIn : false});
                }
            });
    }

    render(){
        return (
            <header className="container my-3 pb-3">
                <div className="row">
                    <div id="logo" className="col-md-8 mb-3">
                        <Link to="/">
                            <img src="img/logo.png" />
                            <span>Галерея изображений</span>
                        </Link>
                    </div>
                    {/*<AuthPanel loggedIn={this.state.loggedIn} user={this.state.name}/>*/}
                    <AuthPanel />
                </div>
            </header>
        );
    }
}