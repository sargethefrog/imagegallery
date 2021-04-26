import React from 'react';
import {Redirect} from "react-router-dom";
import * as StackBlur from "stackblur-canvas";
import vintagejs from "vintagejs";
import {Header} from "./Header";
import {host} from "../config";
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';

export class AddImage extends React.Component{

    constructor() {
        super();
        this.state = {};
        this.handlerSubmit = this.handlerSubmit.bind(this);
        this.handlerDrop = this.handlerDrop.bind(this);
        this.handlerBlurChange = this.handlerBlurChange.bind(this);
        this.handlerBrightnessChange = this.handlerBrightnessChange.bind(this);
        this.handlerContrastChange = this.handlerContrastChange.bind(this);
        this.handlerSaturationChange = this.handlerSaturationChange.bind(this);
        this.handlerControlsChange = this.handlerControlsChange.bind(this);
        this.handlerSelectFile = this.handlerSelectFile.bind(this);
        this.handlerFileChange = this.handlerFileChange.bind(this);
        this.handlerInput = this.handlerInput.bind(this);
        this.bufferCanvas = document.createElement('canvas');
    }

    componentDidMount(){
        const formData = new FormData();
        formData.append('id',this.props.match.params.id);
        fetch(host + '/getAlbum',{
            method : 'POST',
            body : formData
        }).then(response => response.json())
            .then(result => {
                if(result.result == 'error'){
                    this.setState({info : <Redirect to="/" />});
                } else {
                    const albumResult = result;
                    fetch(host + '/getUser',{
                        credentials : "include"
                    }).then(response => response.json())
                        .then(result => {
                            if(result.id != albumResult.user_id){
                                this.setState({info : <Redirect to="/" />});
                            } else {
                                this.setState({
                                    blurValue : 0,
                                    brightnessValue : 0,
                                    contrastValue : 0,
                                    saturationValue : 10,
                                    fileAdded : false
                                });
                            }
                        });
                }
            });
    }

    handlerInput(e){
        const name = e.target.name;
        const value = e.target.value;
        this.setState({[name] : value});
    }

    handlerSubmit(e){
        e.preventDefault();
        if(this.state.fileAdded){
            const fileCanvas = this.refs.file_canvas;
            const dataURL = fileCanvas.toDataURL('image/jpeg');
            const fileContent = dataURL.slice(dataURL.indexOf(",") + 1);
            //const formData = new FormData(e.target);
            const formData = new FormData();
            formData.append('album_id',this.props.match.params.id);
            formData.append('title',this.state.title);
            formData.append('description',this.state.description);
            formData.append('data',fileContent);
            fetch(host + '/uploadImage',{
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
        } else {
            this.setState({info : <div id="info" className="error">Необходимо сначала выбрать файл!</div>});
        }

    }

    handlerDragOver(e){
        e.preventDefault();
    }

    handlerDragLeave(e){
        e.preventDefault();
    }

    handlerSelectFile(){
        this.refs.image_file.click();
    }

    fileProcessing(files){
        const file = files[0];
        console.log(file);
        const reader = new FileReader();
        const fileCanvas = this.refs.file_canvas;
        const bufferCanvas = this.bufferCanvas;
        let component = this;
        reader.onload = function(e){
            //output.innerText = e.target.result;
            let img = new Image();
            img.src = e.target.result;
            img.onload = function(){
                let imgWidth = this.naturalWidth;
                let imgHeight = this.naturalHeight;
                fileCanvas.hidden = false;
                fileCanvas.width = imgWidth;
                fileCanvas.height = imgHeight;
                bufferCanvas.width = fileCanvas.width;
                bufferCanvas.height = fileCanvas.height;
                const ctx = fileCanvas.getContext('2d');
                const bctx = bufferCanvas.getContext('2d');
                bctx.drawImage(this,0,0);
                ctx.drawImage(bufferCanvas, 0, 0);
                img = null;
                component.setState({fileAdded : true});
            };
        };
        reader.readAsDataURL(file);
    }

    handlerFileChange(e){
        this.fileProcessing(e.target.files);
    }

    handlerBlurChange(e){
        let v = e.target.value;
        this.setState({blurValue : v});
        const ctx = this.refs.file_canvas.getContext('2d');
        ctx.drawImage(this.bufferCanvas, 0, 0);
        const fileCanvas = this.refs.file_canvas;
        StackBlur.canvasRGB(
            fileCanvas, 0, 0, fileCanvas.width, fileCanvas.height, v
        );
    }

    handlerControlsChange(e){
        let name = e.target.name;
        let value = e.target.value;
        this.setState({[name] : value});
        /*console.log('VAL : ',this.refs.brightnessRange.state.value);*/
        let brightness = this.refs.brightnessRange.value / 10;
        let contrast = this.refs.contrastRange.value / 10;
        let saturation = this.refs.saturationRange.value / 10;
        let blur = +this.refs.blurRange.value;
        let sepia = this.refs.sepiaCheckbox.checked;
        let gray = this.refs.grayscaleCheckbox.checked;
        console.log(blur);
        const effect = {brightness : brightness,contrast : contrast,saturation : saturation};
        if(sepia){
            effect.sepia = true;
        }
        if(gray){
            effect.gray = true;
        }
        console.log(effect);
        const srcElt = this.bufferCanvas;
        const ctx = this.refs.file_canvas.getContext('2d');
        vintagejs(srcElt,effect)
            .then(res => {
                if(!blur){
                    ctx.drawImage(res.getCanvas(),0,0);
                } else {
                    let processedCanvas = res.getCanvas();
                    StackBlur.canvasRGB(
                        processedCanvas, 0, 0, processedCanvas.width, processedCanvas.height, blur
                    );
                    ctx.drawImage(processedCanvas,0,0);
                }
            });
    }

    /*handlerControlsChange(){
        alert(this);
    }*/

    handlerBrightnessChange(e){
        let v = e.target.value;
        this.setState({brightnessValue : v});
        //const srcElt = this.refs.file_canvas;
        const srcElt = this.bufferCanvas;
        //const ctx = srcElt.getContext('2d');
        const ctx = this.refs.file_canvas.getContext('2d');
        vintagejs(srcElt,{brightness : v / 10})
            .then(res => {
                ctx.drawImage(res.getCanvas(),0,0);
            });
    }

    handlerContrastChange(e){
        let v = e.target.value;
        this.setState({contrastValue : v});
        const srcElt = this.bufferCanvas;
        const ctx = this.refs.file_canvas.getContext('2d');
        vintagejs(srcElt,{contrast : v / 10})
            .then(res => {
                ctx.drawImage(res.getCanvas(),0,0);
            });
    }

    handlerSaturationChange(e){
        let v = e.target.value;
        this.setState({saturationValue : v});
        const srcElt = this.bufferCanvas;
        const ctx = this.refs.file_canvas.getContext('2d');
        vintagejs(srcElt,{saturation : v / 10})
            .then(res => {
                ctx.drawImage(res.getCanvas(),0,0);
            });
    }

    handlerDrop(e){
        e.preventDefault();
        const files = e.dataTransfer.files;
        this.fileProcessing(files);
    }
    render(){
        return (
            <>
                <Header />
                <div className="container">
                    <h1 className="text-center">Добавить изображение</h1>
                    {this.state.info}
                    <form id="add_image_form" onSubmit={this.handlerSubmit}>
                            <input type="text" name="title" className="form-control my-3" placeholder="Заголовок" onChange={this.handlerInput} />
                                <textarea name="description" placeholder="Описание"
                                          className="form-control my-3" onChange={this.handlerInput}></textarea>
                                <input type="file" name="imagefile" className="form-control my-3" ref="image_file" onChange={this.handlerFileChange}/>
                                    <div id="drop_zone" onDragOver={this.handlerDragOver} onDragLeave={this.handlerDragLeave} onDrop={this.handlerDrop}>
                                        <div id="upload_icon_wrapper">
                                            <i className="fas fa-file-upload"></i>

                                        </div>
                                        <button id="selectFile" type="button" onClick={this.handlerSelectFile}>Обзор...</button>
                                    </div>
                                    <div id="file_canvas_wrapper">
                                        <canvas id="file_canvas" hidden ref="file_canvas"></canvas>
                                    </div>
                                    <div id="controls" className="my-2">
                                        <i className="fas fa-star-of-life"></i>
                                        Яркость :
                                        <input id="brightnessRange" type="range" min="-10" max="10" value={this.state.brightnessValue} onChange={this.handlerControlsChange} ref="brightnessRange" name="brightnessValue" />
                                        <br />
                                        {/*<Slider
                                            min={-50}
                                            max={50}
                                            handleStyle={{backgroundColor : '#99cc41', width : '20px', height : '20px',top : '2px',border : 'none'}}
                                            trackStyle={{backgroundColor : '#9DE71E'}}
                                            ref="brightnessRange"
                                            name="brightnessValue"
                                            onChange={this.handlerControlsChange}
                                            defaultValue={0}
                                        />*/}
                                        <i className="fas fa-adjust"></i>
                                        Контраст :
                                        <input id="contrastRange" type="range" min="-10" max="10" value={this.state.contrastValue} onChange={this.handlerControlsChange} ref="contrastRange" name="contrastValue" />
                                        <br />
                                        <i className="fas fa-palette"></i>
                                        Насыщенность :
                                        <input id="saturationRange" type="range" min="0" max="10" value={this.state.saturationValue} onChange={this.handlerControlsChange} ref="saturationRange" name="saturationValue" />
                                        <br />
                                        <i className="fas fa-tint"></i>
                                        Размытие :
                                        <input id="blurRange" type="range" min="0" max="50" value={this.state.blurValue} onChange={this.handlerControlsChange} ref="blurRange" name="blurValue" />
                                        <br />
                                        <label><input id="sepiaCheckbox" type="checkbox" ref="sepiaCheckbox" onChange={this.handlerControlsChange} />Сепия</label>
                                        <br />
                                        <label><input id="grayscaleCheckbox" type="checkbox" ref="grayscaleCheckbox" onChange={this.handlerControlsChange} />Оттенки серого</label>
                                    </div>
                                    <input type="submit" name="add_image_submit"
                                           className="form-control btn btn-primary my-3" value="Добавить изображение" />
                    </form>
                </div>
            </>
        );

    }
}