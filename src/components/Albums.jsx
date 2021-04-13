import React from 'react';
import {Link} from "react-router-dom";

function Album(props){
    //alert(props.count);
    if(props.count != 0){
        return (
            <div className="col-md-4 my-3">
                <div className="album_info">
                    <h3 className="text-center my-1">
                        <Link to={/album/ + props.id}>{props.title}</Link>
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
                <img src={'uploads/' + props.filename} alt={props.title} />
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
                    <Link to="/add_image" className="add_image_link">
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

export class Albums extends React.Component{
    constructor() {
        super();
        this.state = {
            albums : []
        };
    }
    componentDidMount(){
        let albums = [];
        fetch('http://y91756wn.beget.tech/imagegallery/php/getAlbums.php')
            .then(response => response.json())
            .then(result => {
                result.forEach((album,i) => {
                    console.log(album);
                    albums.push(<Album
                        title={album.title}
                        description={album.description}
                        count={album.count}
                        filename = {album.filename}
                        id={album.id}
                    />);
                    console.log(this.state);
                });
                this.setState({albums : albums});
            });
    }
    render(){
        return (
            <>
                <div className="container images">
                    <h2>
                        Альбомы
                        <Link to="/add_album" className="add_album_btn" title="Добавить альбом">+</Link>
                    </h2>
                    <div className="row">
                        {this.state.albums}
                    </div>
                </div>
            </>
        );
    }
}