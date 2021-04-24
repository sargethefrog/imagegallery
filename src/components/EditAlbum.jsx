import React from 'react';
import {Header} from "./Header";
import {host} from "../config";

export class EditAlbum extends React.Component{
    constructor() {
        super();
        this.state = {};
        this.handlerInput = this.handlerInput.bind(this);
        this.handlerSubmit = this.handlerSubmit.bind(this);
    }
    handlerInput(e){
        const name = e.target.name;
        const value = e.target.value;
        this.setState({[name] : value});
    }
    componentDidMount() {
        console.log(this);
        const formData = new FormData();
        formData.append('id',this.props.match.params.id);
        fetch(host + '/getAlbum',{
            method : 'POST',
            body : formData
        }).then(response => response.json())
            .then(result => {
                this.setState({
                    title : result.title,
                    description : result.description
                });
            });
    }
    handlerSubmit(e){
        e.preventDefault();
        const formData = new FormData(e.target);
        formData.append('album_id',this.props.match.params.id);
        fetch(host + '/handlerEditAlbum',{
            method : 'POST',
            body : formData
        }).then(response => response.json())
            .then(result => {
                if(result.result === 'success'){
                    this.setState({info : <div id="info" className="success">Изменения сохранены.</div>});
                } else {
                    this.setState({info : <div id="info" className="error">Ошибка сохранения изменений.</div>});
                }
            });
    }
    render(){
        return (
            <>
                <Header />
                <div className="container">
                    <h1 className="text-center">Редактирование</h1>
                    {this.state.info}
                    <form id="edit_album_form" onSubmit={this.handlerSubmit}>
                        <input type="hidden" name="album_id" value="" />
                            <input type="text" name="title" className="form-control my-3" placeholder="Название" required
                                    value={this.state.title} onChange={this.handlerInput}/>
                                <textarea name="description" placeholder="Описание" className="form-control"
                                          required value={this.state.description} onChange={this.handlerInput}>
                                </textarea>
                                <input type="submit" name="add_album_submit" className="form-control btn btn-primary my-3"
                                       value="Сохранить" />
                    </form>
                </div>
            </>
        );
    }
}