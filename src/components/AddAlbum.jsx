import React from 'react';
import {Redirect} from 'react-router-dom';

export class AddAlbum extends React.Component{

    constructor() {
        super();
        this.state = {};
        this.handlerSubmit = this.handlerSubmit.bind(this);
    }
    handlerSubmit(e){
        e.preventDefault();
        const formData = new FormData(e.target);
        fetch('http://y91756wn.beget.tech/imagegallery/php/handlerAddAlbum.php',{
            method : 'POST',
            body : formData
        }).then(response => response.json())
            .then(result => {
                if(result.result === 'success'){
                    //alert('success');
                    this.setState({info : <Redirect to="/"/>});
                } else {
                    this.setState({info : <div id="info" className="error">Ошибка создания альбома.</div>});
                }
            });
    }

    render(){
        return (
            <div className="container">
                <h1 className="text-center">Новый альбом</h1>
                {this.state.info}
                <form id="add_album_form" onSubmit={this.handlerSubmit}>
                    <input type="text" name="title" className="form-control my-3" placeholder="Название" required />
                        <textarea name="description" placeholder="Описание" className="form-control"
                                  required></textarea>
                        <input type="submit" name="add_album_submit" className="form-control btn btn-primary my-3"
                               value="Добавить альбом" />
                </form>
            </div>
        );
    }
}