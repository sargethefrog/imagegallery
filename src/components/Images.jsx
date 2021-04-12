import React from 'react';

function Image(props){
    return (
        <div className="col-md-4 my-3">
            <img src={'uploads/' + props.filename} />
        </div>
    );
}

export class Images extends React.Component{
    constructor() {
        super();
        this.state = {
            attr : `data-masonry='{ "percentPosition": true }'`,
            images : []
        };
    }
    componentDidMount(){
        const formData = new FormData();
        formData.append('album_id',this.props.albumid);
        fetch('http://y91756wn.beget.tech/imagegallery/php/getImages.php',{
            method : 'POST',
            body : formData
        }).then(response => response.json())
            .then(result => {
                console.log(result);
                this.setState({albumTitle : result.album_title});
                this.setState({albumDescription : result.album_description});
                let images = [];
                result.images.forEach(img => {
                    images.push(<Image
                        filename={img.filename}
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
                <p className="album-description my-3">
                    {this.state.albumDescription}
                </p>
                <div className="row" data-masonry=''>
                    {this.state.images}
                </div>
            </div>
        );
    }
}