import React from 'react';
import {Link} from "react-router-dom";
import {Header} from "./Header";
import {host} from "../config";

function SingleImage(props){
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
                let images = [];
                result.images.forEach(img => {
                    images.push(<SingleImage
                        filename={img.filename}
                        title={img.title}
                        description={img.description}
                        datetime={img.datetime}
                    />);
                });
                this.setState({images : images});
                fetch(host + '/php/getUser.php',{
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