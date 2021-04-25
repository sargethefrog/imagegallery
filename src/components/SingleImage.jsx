import React, {useState} from 'react';
import FsLightbox from "fslightbox-react";
import {host} from "../config";
import {Link} from "react-router-dom";

let openSlide;

export function LightBox(props) {
    const [lightboxController, setLightboxController] = useState({
        toggler: false,
        slide: 1
    });

    function openLightboxOnSlide(number) {
        setLightboxController({
            toggler: !lightboxController.toggler,
            slide: number
        });
    }

    openSlide = openLightboxOnSlide;

    return (
        <FsLightbox
            toggler={lightboxController.toggler}
            sources={props.sources}
            type="image"
            slide={lightboxController.slide}
        />
    );
}


export class SingleImage extends React.Component{

    constructor(props) {
        super(props);
        this.state = {};
        this.deleteImage = this.deleteImage.bind(this);
        this.confirmDialog = this.confirmDialog.bind(this);
        this.cancelDelete = this.cancelDelete.bind(this);
        this.showImage = this.showImage.bind(this);
    }

    showImage(){
        openSlide(this.props.index + 1);
    }

    deleteImage(){
        const formData = new FormData();
        formData.append('id',this.props.id);
        fetch(host + '/handlerDeleteImage',{
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
                    this.setState({
                        confirmDialog : ''
                    });
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
        if(this.props.albumTitle){
            this.setState({
                albumTitle : <div className="album_title">
                    <i className="fas fa-images ms-1 me-2"></i>
                    Альбом: <Link to={'/album/' + this.props.album}>{this.props.albumTitle}</Link>
                </div>
            });
        }
        if(this.props.author){
            this.setState({
                authorName : <div className="author_name">
                    <i className="fas fa-user ms-1 me-2"></i>
                    Автор:&nbsp;
                    {this.props.author}
                </div>
            });
        }
    }

    render(){
        return (
            /* <div className="col-md-4 my-3">*/
            <div>
                {this.state.confirmDialog}
                <figure>
                    <figcaption>{this.props.title}</figcaption>
                    <img src={host + '/uploads/' + this.props.filename} alt={this.props.title} onClick={this.showImage}/>
                    <div className="image_description">{this.props.description}</div>
                    {this.state.edit}
                    {this.state.albumTitle}
                    {this.state.authorName}
                    <div className="image_datetime"><i className="fas fa-clock ms-1 me-2"></i>Добавлено
                        : {this.props.datetime}</div>
                    {this.state.delete}
                </figure>
            </div>
        );
    }
}