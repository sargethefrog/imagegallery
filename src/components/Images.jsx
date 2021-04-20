import React from 'react';
import {Link} from "react-router-dom";
import {Header} from "./Header";
import {host} from "../config";

class SingleImage extends React.Component{

    constructor(props) {
        super(props);
        this.state = {};
        this.deleteImage = this.deleteImage.bind(this);
        this.confirmDialog = this.confirmDialog.bind(this);
        this.cancelDelete = this.cancelDelete.bind(this);
    }

    deleteImage(){
        const formData = new FormData();
        formData.append('id',this.props.id);
        fetch(host + '/php/handlerDeleteImage.php',{
            method : 'POST',
            body : formData
        }).then(response => response.json())
            .then(result => {
                if(result.result === 'success'){
                    this.setState({
                        confirmDialog : ''
                    });
                    let images = this.props.parent.state.images;
                    images.splice(this.props.index,1);
                    this.props.parent.setState({
                        images : images
                    });
                } else {
                    alert('Ошибка удаления изображения!');
                }
            });
    }

    cancelDelete(){
        this.setState({
            confirmDialog : ''
        })
    }

    confirmDialog(){
        this.setState({
            confirmDialog :
                <>
                    <div className="black_screen"></div>
                    <div className="confirm_dialog">
                        <p className="text-center title">Удалить изображение?</p>
                        <div className="buttons">
                            <button type="button" className="dialog_red_btn left_btn" onClick={this.deleteImage}>Да</button>
                            <button type="button" className="dialog_green_btn right_btn" onClick={this.cancelDelete}>Отмена</button>
                        </div>
                    </div>
                </>
        });
    }

    componentDidMount(){
        if(this.props.edit){
            this.setState({
                edit : <p><Link to={"/edit_image/" + this.props.id} className="edit_image_link"><i className="fas fa-pen-alt mx-2"></i>Редактировать название и описание</Link>
                <button type="button" className="delete_image_btn" title="Удалить изображение" onClick={this.confirmDialog}>-</button></p>
            });
        } else {
            this.setState({edit : ''});
        }
    }

    render(){
        return (
            <div className="col-md-4 my-3">
                {this.state.confirmDialog}
                <figure>
                    <img src={host + '/uploads/' + this.props.filename} alt={this.props.title}/>
                    <figcaption>{this.props.title}</figcaption>
                    <div className="image_description">{this.props.description}</div>
                    {this.state.edit}
                    <div className="image_datetime"><i className="fas fa-clock ms-1 me-2"></i>Добавлено
                        : {this.props.datetime}</div>
                    {this.state.delete}
                </figure>
            </div>
        );
    }
}

export class Images extends React.Component{
    constructor() {
        super();
        this.state = {
            images : []
        };
    }
    componentDidMount(){
        const formData = new FormData();
        formData.append('album_id',this.props.match.params.id);
        fetch(host + '/php/getImages.php',{
            method : 'POST',
            body : formData
        }).then(response => response.json())
            .then(result => {
                console.log('GET IMAGES : ', result);
                this.setState({
                    albumTitle : result.title,
                    albumDescription : result.description,
                    albumAuthor : result.author,
                    creationDate : result.datetime,
                    albumId : result.id,
                    userId : result.userId
                });
                this.result = result;
                fetch(host + '/php/getUser.php',{
                    credentials : "include"
                }).then(response => response.json())
                    .then(result => {
                        let edit = false;
                        if(result !== 'error' && result.id === this.state.userId){
                            edit = true;
                            this.setState({
                                addImageBtn : <Link to={'/add_image/' + this.state.albumId} title="Добавить изображение"
                                                    className="add_image_btn">+</Link>,
                                editAlbumLink : <Link to={'/edit_album/' + this.state.albumId} className="edit_album"
                                                      title="Редактировать название и описание">
                                    <i className="fas fa-pen-alt mx-2"></i>
                                </Link>
                            });
                        } else {
                            this.setState({addImageBtn : '',editAlbumLink : ''});
                        }
                        let images = [];
                        this.result.images.forEach((img,i) => {
                            images.push(<SingleImage
                                filename={img.filename}
                                title={img.title}
                                description={img.description}
                                datetime={img.datetime}
                                edit={edit}
                                id={img.id}
                                album={this.state.albumId}
                                index={i}
                                parent={this}
                            />);
                        });
                        this.setState({images : images});
                    });
            });
    }
    render(){
        return (
            <>
                <Header />
                <div className="container images">
                    <h1 className="text-center">
                        {this.state.albumTitle}
                        {this.state.editAlbumLink}
                        {this.state.addImageBtn}
                    </h1>
                    <p className="album-author my-3"><i className="fas fa-user ms-1 me-2"></i>Автор : <b>{this.state.albumAuthor}</b>
                    </p>
                    <p className="album-creationdate my-3"><i className="fas fa-clock ms-1 me-2"></i>Время создания
                        : <b>{this.state.creationDate}</b></p>
                    <p className="album-description my-3">
                        {this.state.albumDescription}
                    </p>
                    <div className="row">
                        {this.state.images}
                    </div>
                </div>
            </>
        );
    }
}