import React from 'react';
import {Redirect} from "react-router-dom";

export class SearchPanel extends React.Component{
    constructor() {
        super();
        this.state = {};
        this.showModal = this.showModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.startSearch = this.startSearch.bind(this);
        this.handlerEnter = this.handlerEnter.bind(this);
    }
    showModal(){
        this.setState({
            modal :
            <>
                <div className="black_screen"></div>
                <div className="search_modal">
                    <p className="text-center mt-3">Поиск</p>
                    <div className="search_controls_wrapper">
                        <input type="text" id="search_text_input" autoFocus onKeyUp={this.handlerEnter}/>
                        {/*<button className="start_search" type="button" onClick={this.startSearch}>Искать</button>*/}
                        <input className="start_search" type="button" onClick={this.startSearch} value="Искать" />
                    </div>
                    <i className="fas fa-times-circle close_search" onClick={this.closeModal}></i>
                </div>
            </>
        });
    }
    handlerEnter(e){
        if(e.key === 'Enter'){
            this.startSearch(e);
        }
    }
    closeModal(){
        this.setState({modal : ''});
    }
    startSearch(e){
        let path = window.location.pathname.split('/')[1];
        let searchString;
        if(e.target.type === 'button'){
            searchString = e.target.previousElementSibling.value;
        } else if(e.target.type === 'text'){
            searchString = e.target.value;
        }
        if(path == 'search'){
            /*this.closeModal();
            this.props.search.getResults(searchString);*/
            window.location.href = '/search/' + searchString;
        } else {
            this.setState({modal : <Redirect to={"/search/" + searchString} />});
        }

    }
    render(){
        return (
            <>
                <button type="button" className="open_search_btn" onClick={this.showModal}>
                    <i className="fas fa-search"></i>
                </button>
                {this.state.modal}
            </>
        );
    }
}