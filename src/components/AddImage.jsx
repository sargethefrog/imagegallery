import React from 'react';
import {Redirect} from "react-router-dom";
import {Header} from "./Header";
import {host} from "../config";
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import fx from 'glfx';
export class AddImage extends React.Component{

    constructor() {
        super();
        this.state = {};
        this.handlerSubmit = this.handlerSubmit.bind(this);
        this.handlerDrop = this.handlerDrop.bind(this);
        this.handlerControlsChange = this.handlerControlsChange.bind(this);
        this.handlerSelectFile = this.handlerSelectFile.bind(this);
        this.handlerFileChange = this.handlerFileChange.bind(this);
        this.handlerInput = this.handlerInput.bind(this);
        this.bufferCanvas = document.createElement('canvas');
        this.fileCanvasRef = React.createRef();
        this.brightnessRangeRef = React.createRef();
        this.contrastRangeRef = React.createRef();
        this.saturationRangeRef = React.createRef();
        this.blurRangeRef = React.createRef();
        this.sepiaCheckBoxRef = React.createRef();
        this.grayscaleCheckBoxRef = React.createRef();
        this.imageFileRef = React.createRef();
        this.fxCanvas = fx.canvas();
        //this.filter = new WebGLImageFilter();
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
                                    /*saturationValue : 10,*/
                                    saturationValue : 0,
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
            const dataURL = this.fileCanvasRef.current.toDataURL('image/jpeg');
            const fileContent = dataURL.slice(dataURL.indexOf(",") + 1);
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
        this.imageFileRef.current.click();
    }

    fileProcessing(files){
        const file = files[0];
        console.log(file);
        const reader = new FileReader();
        const bufferCanvas = this.bufferCanvas;
        let component = this;
        reader.onload = function(e){
            let img = new Image();
            img.src = e.target.result;
            img.onload = function(){
                let imgWidth = this.naturalWidth;
                let imgHeight = this.naturalHeight;
                component.fileCanvasRef.current.hidden = false;
                component.fileCanvasRef.current.width = imgWidth;
                component.fileCanvasRef.current.height = imgHeight;
                bufferCanvas.width = component.fileCanvasRef.current.width;
                bufferCanvas.height = component.fileCanvasRef.current.height;
                const ctx = component.fileCanvasRef.current.getContext('2d');
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

    handlerControlsChange(){
        let brightness = this.brightnessRangeRef.current.state.value / 10;
        let contrast = this.contrastRangeRef.current.state.value / 10;
        let saturation = this.saturationRangeRef.current.state.value / 10;
        let blur = +this.blurRangeRef.current.state.value;
        let sepia = this.sepiaCheckBoxRef.current.checked;
        let gray = this.grayscaleCheckBoxRef.current.checked;
        const srcElt = this.bufferCanvas;
        const ctx = this.fileCanvasRef.current.getContext('2d');
        const tx = this.fxCanvas.texture(srcElt);
        this.fxCanvas.draw(tx);
        if(brightness || contrast){
            this.fxCanvas.brightnessContrast(brightness,contrast);
        }
        if(blur){
            this.fxCanvas.triangleBlur(blur);
        }
        if(saturation){
            this.fxCanvas.hueSaturation(0,saturation);
        }
        if(sepia){
            this.fxCanvas.sepia(1);
        }
        if(gray){
            this.fxCanvas.hueSaturation(0,-1);
        }
        this.fxCanvas.update();
        ctx.drawImage(this.fxCanvas,0,0);
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
                        <input type="text" name="title" className="form-control my-3" placeholder="Заголовок" onChange={this.handlerInput} value={this.state.title}/>
                        <textarea name="description" placeholder="Описание"
                                  className="form-control my-3" onChange={this.handlerInput} value={this.state.description}></textarea>
                        <input type="file" name="imagefile" className="form-control my-3" ref={this.imageFileRef} onChange={this.handlerFileChange} accept="image/jpeg"/>
                        <div id="drop_zone" onDragOver={this.handlerDragOver} onDragLeave={this.handlerDragLeave} onDrop={this.handlerDrop}>
                            <div id="upload_icon_wrapper">
                                <i className="fas fa-file-upload"></i>
                            </div>
                            <button id="selectFile" type="button" onClick={this.handlerSelectFile}>Обзор...</button>
                        </div>
                        <div id="file_canvas_wrapper">
                            <canvas id="file_canvas" hidden ref={this.fileCanvasRef}></canvas>
                        </div>
                        <div id="controls" className="my-2">
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-4">
                                        <i className="fas fa-star-of-life"></i>
                                        Яркость :
                                    </div>
                                    <div className="col-md-8">
                                        <Slider
                                            min={-11}
                                            max={11}
                                            handleStyle={{backgroundColor : '#99cc41', width : '20px', height : '20px',top : '2px',border : 'none'}}
                                            trackStyle={{backgroundColor : '#9DE71E'}}
                                            ref={this.brightnessRangeRef}
                                            name="brightnessValue"
                                            onChange={this.handlerControlsChange}
                                            defaultValue={0}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-4">
                                        <i className="fas fa-adjust"></i>
                                        Контраст :
                                    </div>
                                    <div className="col-md-8">
                                        <Slider
                                            min={-11}
                                            max={11}
                                            handleStyle={{backgroundColor : '#99cc41', width : '20px', height : '20px',top : '2px',border : 'none'}}
                                            trackStyle={{backgroundColor : '#9DE71E'}}
                                            ref={this.contrastRangeRef}
                                            name="contrastValue"
                                            onChange={this.handlerControlsChange}
                                            defaultValue={0}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-4">
                                        <i className="fas fa-palette"></i>
                                        Насыщенность :
                                    </div>
                                    <div className="col-md-8">
                                        <Slider
                                            min={-11}
                                            max={11}
                                            handleStyle={{backgroundColor : '#99cc41', width : '20px', height : '20px',top : '2px',border : 'none'}}
                                            trackStyle={{backgroundColor : '#9DE71E'}}
                                            ref={this.saturationRangeRef}
                                            name="saturationValue"
                                            onChange={this.handlerControlsChange}
                                            defaultValue={0}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-4">
                                        <i className="fas fa-tint"></i>
                                        Размытие :
                                    </div>
                                    <div className="col-md-8">
                                        <Slider
                                            min={0}
                                            max={50}
                                            handleStyle={{backgroundColor : '#99cc41', width : '20px', height : '20px',top : '2px',border : 'none'}}
                                            trackStyle={{backgroundColor : '#9DE71E'}}
                                            ref={this.blurRangeRef}
                                            name="blurValue"
                                            onChange={this.handlerControlsChange}
                                            defaultValue={0}
                                        />
                                    </div>
                                    <label><input id="sepiaCheckbox" type="checkbox" ref={this.sepiaCheckBoxRef} onChange={this.handlerControlsChange} />Сепия</label>
                                    <br />
                                    <label><input id="grayscaleCheckbox" type="checkbox" ref={this.grayscaleCheckBoxRef} onChange={this.handlerControlsChange} />Оттенки серого</label>
                                </div>
                            </div>
                        </div>
                        <input type="submit" name="add_image_submit"
                               className="form-control btn btn-primary my-3" value="Добавить изображение" />
                    </form>
                </div>
            </>
        );
    }

}