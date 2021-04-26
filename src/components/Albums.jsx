import React from 'react';
import {Link, Redirect} from "react-router-dom";
import {Header} from "./Header";
import {host} from "../config";
import Masonry from 'react-masonry-css';

class Album extends React.Component{

    constructor(props) {
        super(props);
        this.state = {};
        this.confirmDialog = this.confirmDialog.bind(this);
        this.cancelDelete = this.cancelDelete.bind(this);
        this.deleteAlbum = this.deleteAlbum.bind(this);
    }

    confirmDialog(){
        this.setState({
            confirmDialog :
                <>
                    <div className="black_screen"></div>
                    <div className="confirm_dialog">
                        <p className="text-center title">Удалить альбом?</p>
                        <div className="buttons">
                            <button type="button" className="dialog_red_btn left_btn" onClick={this.deleteAlbum}>Да</button>
                            <button type="button" className="dialog_green_btn right_btn" onClick={this.cancelDelete}>Отмена</button>
                        </div>
                    </div>
                </>
        });
    }

    cancelDelete(){
        this.setState({
            confirmDialog : ''
        })
    }

    deleteAlbum(){
        const formData = new FormData();
        formData.append('id',this.props.id);
        fetch(host + '/handlerDeleteAlbum',{
            method : 'POST',
            body : formData
        }).then(response => response.json())
            .then(result => {
                if(result.result === 'success'){
                    this.setState({
                        confirmDialog : ''
                    });
                    let albums = this.props.parent.state.albums;
                    albums.splice(this.props.index,1);
                    this.props.parent.setState({
                        albums : albums
                    })
                } else {
                    this.setState({
                        confirmDialog : ''
                    });
                    alert('Ошибка удаления альбома!');
                }
            });
    }

    componentDidMount(){
        if(this.props.edit){
            this.setState({
                addImageBtn : <Link to={'/add_image/' + this.props.id} title="Добавить изображение"
                                    className="add_image_btn">+</Link>,
                addImageLink : <Link to={'/add_image/' + this.props.id} className="add_image_link">
                    Добавить
                </Link>,
                editAlbumLink : <Link to={'/edit_album/' + this.props.id} className="edit_album"
                                      title="Редактировать название и описание">
                    <i className="fas fa-pen-alt mx-2"></i>
                </Link>,
                deleteAlbumBtn : <button type="button" className="delete_image_btn" title="Удалить альбом" onClick={this.confirmDialog}>-</button>
            });
        }
    }

    render(){
        if(this.props.count != 0){
            return (
                <div>
                    {this.state.confirmDialog}
                    <div className="album_info">
                        <h3 className="text-center my-2">
                            {this.state.addImageBtn}
                            <Link to={'/album/' + this.props.id}>{this.props.title}</Link>
                            {this.state.editAlbumLink}
                            {this.state.deleteAlbumBtn}
                        </h3>
                        <p className="description px-1">
                            {this.props.description}
                        </p>
                        <p className="totally_images px-1">Всего изображений : {this.props.count}</p>
                    </div>

                    <img src={host + '/uploads/' + this.props.filename} alt={this.props.title} />
                </div>
            );
        } else if(this.props.edit){
            return (
                <div className="no_images">
                    {this.state.confirmDialog}
                    <h3 className="text-center my-2">
                        {this.props.title}
                        {this.state.editAlbumLink}
                        {this.state.deleteAlbumBtn}
                    </h3>
                    <p className="description px-1">
                        {this.props.description}
                    </p>
                    <p>
                        В этом альбоме пока нет изображений.
                        {this.state.addImageLink}
                    </p>
                </div>
            );
        } else {
            return null;
        }
    }
}

export class Albums extends React.Component{
    constructor() {
        super();
        this.state = {
            albums : [],
            loggedIn : false
        };
    }
    componentDidMount(){
        let albums = [];
        fetch(host + '/getUser',{
            credentials : "include"
        }).then(response => response.json())
            .then(result => {
                if(result.result === 'error'){
                    this.setState({loggedIn : false});
                } else {
                    this.setState({
                        loggedIn : true,
                        userId : result.id,
                        addAlbumLink : <Link to="/add_album" className="add_album_btn" title="Добавить альбом">+</Link>
                    });
                }
                fetch(host + '/getAlbums')
                    .then(response => response.json())
                    .then(result => {
                        result.forEach((album,i) => {
                            let canEditAlbum = false;
                            if(album.user_id === this.state.userId){
                                canEditAlbum = true;
                            }
                            albums.push(<Album
                                title={album.title}
                                description={album.description}
                                count={album.count}
                                filename = {album.filename}
                                id={album.id}
                                edit={canEditAlbum}
                                index={i}
                                parent={this}
                                key={i}
                            />);
                        });
                        this.setState({albums : albums});
                    });

            });
    }
    render(){
        const breakpointColumnsObj = {
            default: 3,
            1100: 2,
            700: 1,
        };
        return (
            <>
                <Header />
                <div className="container images">
                    <h2>
                        Альбомы
                        {this.state.addAlbumLink}
                    </h2>
                    <div className="row">
                        {/*{this.state.albums}*/}
                        <Masonry
                            breakpointCols={breakpointColumnsObj}
                            className="my-masonry-grid"
                            columnClassName="my-masonry-grid_column">
                            {/* array of JSX items */}
                            {this.state.albums}
                        </Masonry>
                    </div>
                </div>
            </>
        );
    }
}