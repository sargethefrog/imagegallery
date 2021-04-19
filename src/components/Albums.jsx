import React from 'react';
import {Link} from "react-router-dom";
import {Header} from "./Header";

function Album_old(props){
    if(props.count != 0){
        return (
            <div className="col-md-4 my-3">
                <div className="album_info">
                    <h3 className="text-center my-1">
                        <Link to={'/album/' + props.id}>{props.title}</Link>
                        <Link to={'/edit_album/' + props.id} className="edit_album"
                              title="Редактировать название и описание">
                            <i className="fas fa-pen-alt mx-2"></i>
                        </Link>
                    </h3>
                    <p className="totally_images px-1">Всего изображений : {props.count}</p>
                    <p className="description px-1">
                        {props.description}
                    </p>
                </div>
                <Link to={'/add_image/' + props.id} title="Добавить изображение"
                   className="add_image_btn">+</Link>
                <img src={'http://y91756wn.beget.tech/imagegallery/uploads/' + props.filename} alt={props.title} />
            </div>
        );
    } else {
        return (
            <div className="col-md-4 my-3 no_images">
                <h3 className="text-center my-1">
                    {props.title}
                    <Link to={'/edit_album/' + props.id} className="edit_album"
                          title="Редактировать название и описание">
                        <i className="fas fa-pen-alt mx-2"></i>
                    </Link>
                </h3>
                <p>В этом альбоме пока нет изображений.
                    <Link to={'/add_image/' + props.id} className="add_image_link">
                        Добавить
                    </Link>
                </p>
                <p className="description px-1">
                    {props.description}
                </p>
            </div>
        );
    }

}

class Album extends React.Component{

    constructor(props) {
        super(props);
        this.state = {};
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
                </Link>
            });
        }
    }

    render(){
        if(this.props.count != 0){
            return (
                <div className="col-md-4 my-3">
                    <div className="album_info">
                        <h3 className="text-center my-1">
                            <Link to={'/album/' + this.props.id}>{this.props.title}</Link>
                            {this.state.editAlbumLink}
                        </h3>
                        <p className="totally_images px-1">Всего изображений : {this.props.count}</p>
                        <p className="description px-1">
                            {this.props.description}
                        </p>
                    </div>
                    {this.state.addImageBtn}
                    <img src={'http://y91756wn.beget.tech/imagegallery/uploads/' + this.props.filename} alt={this.props.title} />
                </div>
            );
        } else {
            return (
                <div className="col-md-4 my-3 no_images">
                    <h3 className="text-center my-1">
                        {this.props.title}
                        {this.state.editAlbumLink}
                    </h3>
                    <p>
                        В этом альбоме пока нет изображений.
                        {this.state.addImageLink}
                    </p>
                    <p className="description px-1">
                        {this.props.description}
                    </p>
                </div>
            );
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
        fetch('http://y91756wn.beget.tech/imagegallery/php/getUser.php',{
            credentials : "include"
        }).then(response => response.json())
            .then(result => {
                console.log('ALBUMS : LOGGED IN : ', result);
                if(result.result === 'error'){
                    this.setState({loggedIn : false});
                } else {
                    this.setState({
                        loggedIn : true,
                        userId : result.id,
                        addAlbumLink : <Link to="/add_album" className="add_album_btn" title="Добавить альбом">+</Link>
                    });
                }
                fetch('http://y91756wn.beget.tech/imagegallery/php/getAlbums.php')
                    .then(response => response.json())
                    .then(result => {
                        result.forEach((album) => {
                            console.log(album);
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
                            />);
                            console.log(this.state);
                        });
                        this.setState({albums : albums});
                    });

            });
    }
    render(){
        return (
            <>
                <Header />
                <div className="container images">
                    <h2>
                        Альбомы
                        {/*<Link to="/add_album" className="add_album_btn" title="Добавить альбом">+</Link>*/}
                        {this.state.addAlbumLink}
                    </h2>
                    <div className="row">
                        {this.state.albums}
                    </div>
                </div>
            </>
        );
    }
}