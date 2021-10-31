import React from "react";

export class GameContainer extends React.Component{
    render(){
        return (
            <div className="game-container">
                <Inventory/>
                <GameText/>
                <Options list={["Continue walking", "Inspect the object"]} onSelection={(e) => alert(e)}/>
            </div>
        );
    }
}

export class Inventory extends React.Component{
    render(){
        return (
            <div className="inventory">
                
            </div>
        );
    }
}

export class GameText extends React.Component{
    render(){
        return (
            <div className="game-text">
                
            </div>
        );
    }
}

export class Options extends React.Component{
    constructor(){
        super();
    }
    
    handleKeyDown = ((e) => {
        if(!isNaN(e.key)){
            this.handleSelection(e.key)
        }
    }).bind(this);

    componentDidMount(){
        window.addEventListener('keydown', this.handleKeyDown);
    }

    componentWillUnmount(){
        window.removeEventListener('keydown', this.handleKeyDown);
    }

    handleSelection(num){
        if(typeof this.props.onSelection != "function" || typeof this.props.list != "object"){
            return;
        }

        if(num < 1 || num > this.props.list.length){
            return;
        }
        
        this.props.onSelection(num);
    }

    renderOptions(){
        if(typeof this.props.list != "object"){
            return;
        }

        var lst = this.props.list.slice();

        const mappedList = lst.map((value, key) => {
            let num = key + 1;

            return (
                <div onClick={() => this.handleSelection(num)} key={num}>{num}.) {value}</div>
            );
        });

        return mappedList;
    }

    render(){
        return (
            <div className="options">
                {this.renderOptions()}
            </div>
        );
    }
}