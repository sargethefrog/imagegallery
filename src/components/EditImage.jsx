import React from 'react';
import {Header} from "./Header";
import {host} from "../config";
import {Redirect} from "react-router-dom";

export class EditImage extends React.Component{

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

    handlerSubmit(e){
        e.preventDefault();
        const formData = new FormData(e.target);
        formData.append('id',this.props.match.params.id);
        fetch(host + '/handlerEditImage',{
            method : 'POST',
            body : formData
        }).then(response => response.json())
            .then(result => {
                if(result.result === 'success'){
                    this.setState({
                        info : <div id="info" className="success">Изменения сохранены.</div>
                    });
                } else {
                    this.setState({
                        info : <div id="info" className="error">Ошибка сохранения изменений.</div>
                    });
                }
            });
    }

    componentDidMount(){
        const formData = new FormData();
        formData.append('id',this.props.match.params.id);
        fetch(host + '/getImage',{
            method : 'POST',
            body : formData
        }).then(response => response.json())
            .then(result => {
                if(result.result !== 'error'){
                    const imageResult = result;
                    fetch(host + '/getUser',{
                        credentials : "include"
                    }).then(response => response.json())
                        .then(result => {
                            if(result.id != imageResult.user_id){
                                this.setState({info : <Redirect to="/" />});
                            } else {
                                this.setState({
                                    title : imageResult.title,
                                    description : imageResult.description
                                });
                            }
                        });
                } else {
                    this.setState({info : <Redirect to="/" />});
                }
            });
    }
    render(){
        return (
            <>
                <Header />
                <div className="container">
                    <h1 className="text-center">Редактировать название и описание</h1>
                    <form  className="edit_image_form" onSubmit={this.handlerSubmit}>
                        {this.state.info}
                        <input type="text" onChange={this.handlerInput} name="title" className="form-control my-3" placeholder="Заголовок" value={this.state.title} />
                        <textarea onChange={this.handlerInput} name="description" placeholder="Описание"
                                  className="form-control my-3" value={this.state.description}></textarea>
                        <input type="submit" name="edit_image_submit"
                               className="form-control btn btn-primary my-3" value="Сохранить изменения" />
                    </form>
                </div>
            </>
        );
    }
}