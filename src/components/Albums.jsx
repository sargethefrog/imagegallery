import React from 'react';

function Album(props){
    return (
        <div className="col-md-4 my-3">
            <div className="album_info">
                <h3 className="text-center my-1">
                    <a href="">{props.title}</a>
                    <a href="" className="edit_album"
                       title="Редактировать название и описание">
                        <i className="fas fa-pen-alt mx-2"></i>
                    </a>
                </h3>
                <p className="totally_images px-1">Всего изображений : {props.count}</p>
                <p className="description px-1">
                    {props.description}
                </p>
            </div>
            <img src={'uploads/' + props.filename} alt={props.title} />
        </div>
    );
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
                result.forEach(album => {
                    console.log(album);
                    albums.push(<Album
                        title={album.title}
                        description={album.description}
                        count={album.count}
                        filename = {album.filename}
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
                    <h2>Альбомы</h2>
                    <div className="row" data-masonry='{ "percentPosition": true }'>
                        {this.state.albums}
                    </div>
                </div>
            </>
        );
    }
}