import React from 'react';

function SingleImage(props){
    return (
        <div className="col-md-4 my-3">
            <img src={'http://y91756wn.beget.tech/imagegallery/uploads/' + props.filename} alt={props.title}/>
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
        fetch('http://y91756wn.beget.tech/imagegallery/php/getImages.php',{
            method : 'POST',
            body : formData
        }).then(response => response.json())
            .then(result => {
                console.log(result);
                this.setState({albumTitle : result.album_title});
                this.setState({albumDescription : result.album_description});
                this.setState({albumAuthor : result.author});
                this.setState({creationDate : result.datetime});
                let images = [];
                result.images.forEach(img => {
                    images.push(<SingleImage
                        filename={img.filename}
                        title={img.title}
                    />);
                });
                this.setState({images : images});
            });
    }
    render(){
        return (
            <div className="container images">
                <h1 className="text-center">
                    {this.state.albumTitle}
                </h1>
                <p className="album-author my-3"><i className="fas fa-user ms-1 me-2"></i>Автор : <b>{this.state.albumAuthor}</b>
                </p>
                <p className="album-creationdate my-3"><i className="fas fa-clock ms-1 me-2"></i>Дата создания
                    : <b>{this.state.creationDate}</b></p>
                <p className="album-description my-3">
                    {this.state.albumDescription}
                </p>
                <div className="row">
                    {this.state.images}
                </div>
            </div>
        );
    }
}