import React from 'react';
import {host} from "../config";
import {Link, Redirect} from "react-router-dom";
import {LightBox, SingleImage} from "./SingleImage";
import {Header} from "./Header";
import Masonry from "react-masonry-css";

export class Search extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            images : []
        };
    }

    getResults(){
        const formData = new FormData();
        formData.append('search',this.props.match.params.search);
        fetch(host + '/php/handlerSearch.php',{
            method : 'POST',
            body : formData
        }).then(response => response.json())
            .then(result => {
                console.log('GET IMAGES (SEARCH) : ', result);
                this.setState({
                    albumTitle : result.title,
                    albumDescription : result.description,
                    albumAuthor : result.author,
                    creationDate : result.datetime,
                    albumId : result.id,
                    userId : result.userId
                });
                this.result = result;
                fetch(host + '/php/getUser.php',{
                    credentials : "include"
                }).then(response => response.json())
                    .then(result => {
                        let images = [];
                        let sources = [];
                        if(this.result && this.result.length){
                            this.result.forEach((img,i) => {
                                let edit = false;
                                if(result.id == img.author_id){
                                    edit = true;
                                }
                                images.push(<SingleImage
                                    filename={img.filename}
                                    title={img.title}
                                    description={img.description}
                                    datetime={img.datetime}
                                    edit={edit}
                                    id={img.id}
                                    album={img.album_id}
                                    index={i}
                                    parent={this}
                                    albumTitle={img.album_title}
                                    author={img.author}
                                />);
                                sources.push(host + '/uploads/' + img.filename);
                            });
                            this.setState({images : images, sources : sources});
                        }
                    });
            });
    }

    componentDidMount(){
        this.getResults();
    }
    render(){
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
        if(this.state.images && this.state.sources){
            return (
                <>
                    <Header />
                    <div className="container images">
                        <h1 className="text-center">
                            Поиск
                        </h1>
                        <p className="search_results">
                            Результаты поиска по запросу {`'${this.props.match.params.search}'`}
                        </p>
                        <div className="row">

                            <Masonry
                                breakpointCols={breakpointColumnsObj}
                                className="my-masonry-grid"
                                columnClassName="my-masonry-grid_column">
                                {/* array of JSX items */}
                                {this.state.images}
                            </Masonry>
                        </div>
                        <LightBox sources={this.state.sources} />
                    </div>
                </>
            );
        } else {
            return (
                <>
                    <Header />
                    <div className="container images">
                        <h1 className="text-center">
                            Поиск
                        </h1>
                        <p className="search_results">
                            По запросу {`'${this.props.match.params.search}'`} ничего не найдено.
                        </p>
                        <div className="row">

                        </div>
                    </div>
                </>
            );
        }

    }
}