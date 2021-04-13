import React from 'react';
import {Redirect} from "react-router-dom";

export class AddImage extends React.Component{

    constructor() {
        super();
        this.state = {};
        this.handlerSubmit = this.handlerSubmit.bind(this);
        this.handlerDrop = this.handlerDrop.bind(this);
    }

    handlerInput(e){
        const name = e.target.name;
        const value = e.target.value;
        this.setState({[name] : value});
    }

    handlerSubmit(e){
        e.preventDefault();
        const fileCanvas = this.refs.file_canvas;
        const dataURL = fileCanvas.toDataURL('image/jpeg');
        const fileContent = dataURL.slice(dataURL.indexOf(",") + 1);
        //const formData = new FormData(e.target);
        const formData = new FormData();
        formData.append('album_id',this.props.match.params.id);
        formData.append('title',this.state.title);
        formData.append('description',this.state.description);
        formData.append('data',fileContent);
        fetch('http://y91756wn.beget.tech/imagegallery/php/uploadImage.php',{
            method : 'POST',
            body : formData
        }).then(response => response.json())
            .then(result => {
                if(result.result === 'success'){
                    this.setState({info :  <Redirect to={'/album/' + this.props.match.params.id} />});
                } else {
                    this.setState({info : <div id="info" className="error">Ошибка загрузки изображения.</div>})
                }
            });
    }

    handlerDragOver(e){
        e.preventDefault();
    }

    handlerDragLeave(e){
        e.preventDefault();
    }

    handlerDrop(e){
        e.preventDefault();
        let item = e.dataTransfer.items[0];
        if(item.kind == "file" && item.type.indexOf("image") != -1){
            let f = item.getAsFile();
            f.arrayBuffer().then(buffer => {
                let view = new Uint8Array(buffer);
                let str = '';
                for(let i = 0,l = view.length;i < l;i++){
                    str += String.fromCharCode(view[i]);
                }
                str = "data:" + item.type + ";base64," + window.btoa(str);
                let img = new Image();
                img.src = str;
                const fileCanvas = this.refs.file_canvas;
                img.onload = function(){
                    let imgWidth = this.naturalWidth;
                    let imgHeight = this.naturalHeight;
                    fileCanvas.hidden = false;
                    fileCanvas.width = imgWidth;
                    fileCanvas.height = imgHeight;
                    const ctx = fileCanvas.getContext('2d');
                    ctx.drawImage(this,0,0,imgWidth,imgHeight);
                    img = null;
                    /*const buff = document.createElement('canvas');
                    buff.width = fileCanvas.width;
                    buff.height = fileCanvas.height;
                    const bctx = buff.getContext('2d');
                    bctx.drawImage(this,0,0);
                    ctx.drawImage(buff, 0, 0);
                    blurRange.addEventListener('change',function(){
                        ctx.drawImage(buff, 0, 0);
                        StackBlur.canvasRGB(
                            fileCanvas, 0, 0, fileCanvas.width, fileCanvas.height, blurRange.value
                        );
                    });*/
                };
            });
        }
    }
    render(){
        return (
            <div className="container">
                <h1 className="text-center">Добавить изображение</h1>
                {this.state.info}
                <form id="add_image_form" onSubmit={this.handlerSubmit}>
                        <input type="text" name="title" className="form-control my-3" placeholder="Заголовок" />
                            <textarea name="description" placeholder="Описание"
                                      className="form-control my-3"></textarea>
                            <input type="file" name="imagefile" className="form-control my-3" />
                                <div id="drop_zone" onDragOver={this.handlerDragOver} onDragLeave={this.handlerDragLeave} onDrop={this.handlerDrop}>
                                    <div id="upload_icon_wrapper">
                                        <i className="fas fa-file-upload"></i>

                                    </div>
                                </div>
                                <div id="file_canvas_wrapper">
                                    <canvas id="file_canvas" hidden ref="file_canvas"></canvas>
                                </div>
                                <div id="controls" className="my-2">
                                    Размытие :
                                    <input id="blurRange" type="range" min="0" max="50" value="0" />
                                </div>
                                <input type="submit" name="add_image_submit"
                                       className="form-control btn btn-primary my-3" value="Добавить изображение" />
                </form>
            </div>
        );

    }
}