import React from 'react';
import {Link} from "react-router-dom";
import {Header} from "./Header";
import {host} from "../config";

function SingleImageOld(props){
    return (
        <div className="col-md-4 my-3">
            <figure>
                <img src={host + '/uploads/' + props.filename} alt={props.title}/>
                <figcaption>{props.title}</figcaption>
                <div className="image_description">{props.description}</div>
                <div className="image_datetime"><i className="fas fa-clock ms-1 me-2"></i>Добавлено
                    : {props.datetime}</div>
            </figure>
        </div>
    );
}

class SingleImage extends React.Component{

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount(){
        if(this.props.edit){
            this.setState({
                edit : <p><Link to={"/edit_image/" + this.props.id} className="edit_image_link"><i className="fas fa-pen-alt mx-2"></i>Редактировать название и описание</Link></p>
            });
        } else {
            this.setState({edit : ''});
        }
    }

    render(){
        return (
            <div className="col-md-4 my-3">
                <figure>
                    <img src={host + '/uploads/' + this.props.filename} alt={this.props.title}/>
                    <figcaption>{this.props.title}</figcaption>
                    <div className="image_description">{this.props.description}</div>
                    {this.state.edit}
                    <div className="image_datetime"><i className="fas fa-clock ms-1 me-2"></i>Добавлено
                        : {this.props.datetime}</div>
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
                /*let images = [];
                result.images.forEach(img => {
                    images.push(<SingleImage
                        filename={img.filename}
                        title={img.title}
                        description={img.description}
                        datetime={img.datetime}
                    />);
                });
                this.setState({images : images});*/
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
                        this.result.images.forEach(img => {
                            images.push(<SingleImage
                                filename={img.filename}
                                title={img.title}
                                description={img.description}
                                datetime={img.datetime}
                                edit={edit}
                                id={img.id}
                            />);
                        });
                        this.setState({images : images});
                    });
            });
        /*fetch(host + '/php/getUser.php',{
            credentials : "include"
        }).then(response => response.json())
            .then(result => {
                if(result !== 'error' && result.id === this.state.userId){
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
            });*/
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