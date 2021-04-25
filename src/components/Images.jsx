import React, {useState} from 'react';
import {Link, Redirect} from "react-router-dom";
import {Header} from "./Header";
import {host} from "../config";
import Masonry from 'react-masonry-css';
import FsLightbox from 'fslightbox-react';
import {SingleImage,LightBox} from './SingleImage';

export class Images extends React.Component {
    constructor() {
        super();
        this.state = {
            images: []
        };
        this.deleteAlbum = this.deleteAlbum.bind(this);
        this.confirmDialog = this.confirmDialog.bind(this);
        this.cancelDelete = this.cancelDelete.bind(this);
    }

    cancelDelete() {
        this.setState({
            confirmDialog: ''
        });
    }

    confirmDialog() {
        this.setState({
            confirmDialog:
                <>
                    <div className="black_screen"></div>
                    <div className="confirm_dialog">
                        <p className="text-center title">Удалить альбом?</p>
                        <div className="buttons">
                            <button type="button" className="dialog_red_btn left_btn" onClick={this.deleteAlbum}>Да
                            </button>
                            <button type="button" className="dialog_green_btn right_btn"
                                    onClick={this.cancelDelete}>Отмена
                            </button>
                        </div>
                    </div>
                </>
        });
    }

    deleteAlbum() {
        const formData = new FormData();
        formData.append('id', this.state.albumId);
        fetch(host + '/handlerDeleteAlbum', {
            method: 'POST',
            body: formData
        }).then(response => response.json())
            .then(result => {
                if (result.result === 'success') {
                    this.setState({
                        confirmDialog: <Redirect to="/"/>
                    });

                } else {
                    this.setState({
                        confirmDialog: ''
                    });
                    alert('Ошибка удаления альбома!');
                }
            });
    }

    componentDidMount() {
        const formData = new FormData();
        formData.append('album_id', this.props.match.params.id);
        fetch(host + '/getImages', {
            method: 'POST',
            body: formData
        }).then(response => response.json())
            .then(result => {
                console.log('GET IMAGES : ', result);
                this.setState({
                    albumTitle: result.title,
                    albumDescription: result.description,
                    albumAuthor: result.author,
                    creationDate: result.datetime,
                    albumId: result.id,
                    userId: result.userId
                });
                this.result = result;
                fetch(host + '/getUser', {
                    credentials: "include"
                }).then(response => response.json())
                    .then(result => {
                        let edit = false;
                        if (result !== 'error' && result.id === this.state.userId) {
                            edit = true;
                            this.setState({
                                addImageBtn: <Link to={'/add_image/' + this.state.albumId} title="Добавить изображение"
                                                   className="add_image_btn">+</Link>,
                                editAlbumLink: <Link to={'/edit_album/' + this.state.albumId} className="edit_album"
                                                     title="Редактировать название и описание">
                                    <i className="fas fa-pen-alt mx-2"></i>
                                </Link>,
                                deleteAlbumBtn: <button type="button" className="delete_album_btn"
                                                        title="Удалить альбом" onClick={this.confirmDialog}>-</button>
                            });
                        } else {
                            this.setState({addImageBtn: '', editAlbumLink: ''});
                        }
                        let images = [];
                        let sources = [];
                        let captions = [];
                        this.result.images.forEach((img, i) => {
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
                            sources.push(host + '/uploads/' + img.filename);
                            captions.push(img.title);
                        });
                        this.setState({images: images, sources: sources, captions: captions});
                        console.log('CAPTIONS : ', this.state.captions);
                    });
            });
    }

    render() {
        /*const breakpointColumnsObj = {
            default: 4,
            1100: 3,
            700: 2,
            500: 1
        };*/
        const breakpointColumnsObj = {
            default: 3,
            1100: 2,
            700: 1,
        };
        return (
            <>
                <Header/>
                <div className="container images">
                    {this.state.confirmDialog}
                    <h1 className="text-center">
                        {this.state.albumTitle}
                        {this.state.editAlbumLink}
                        {this.state.addImageBtn}
                        {this.state.deleteAlbumBtn}
                    </h1>
                    <p className="album-author my-3"><i className="fas fa-user ms-1 me-2"></i>Автор
                        : <b>{this.state.albumAuthor}</b>
                    </p>
                    <p className="album-creationdate my-3"><i className="fas fa-clock ms-1 me-2"></i>Время создания
                        : <b>{this.state.creationDate}</b></p>
                    <p className="album-description my-3">
                        {this.state.albumDescription}
                    </p>
                    <div className="row">
                        {/*{this.state.images}*/}
                        <Masonry
                            breakpointCols={breakpointColumnsObj}
                            className="my-masonry-grid"
                            columnClassName="my-masonry-grid_column">
                            {/* array of JSX items */}
                            {this.state.images}
                        </Masonry>
                    </div>
                    <LightBox sources={this.state.sources} captions={this.state.captions}/>
                </div>
            </>
        );
    }
}