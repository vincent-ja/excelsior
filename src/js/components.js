import React from "react";
import * as GameData from "./gamedata";

export class GameContainer extends React.Component{
    state = {
        activeOptions: [
            "Continue walking",
            "Inspect the object"
        ],
        inventory: [
            {
                id: 0
            },
            {
                id: 1
            }
        ]
    };

    render(){
        return (
            <div className="game-container">
                <Inventory items={this.state.inventory}/>
                <GameText/>
                <Options list={this.state.activeOptions} onSelection={(e) => alert(e)}/>
            </div>
        );
    }
}

export class Inventory extends React.Component{
    renderItems(){
        if(typeof this.props.items != "object"){
            return;
        }

        var itms = this.props.items.slice();
        const mappedItems = itms.map((value, key) => {
            return (
                <InventoryItem key={key} id={value.id}/>
            );
        });

        return mappedItems;
    }

    render(){
        return (
            <div className="inventory">
                {this.renderItems()}
            </div>
        );
    }
}

export class InventoryItem extends React.Component{
    state = {
        itemName: "< Unknown >",
        itemDesc: "< Unknown >",
        isHovered: false,
        hoverX: 0,
        hoverY: 0,
    };

    constructor(props){
        super(props);

        if(GameData.Items[this.props.id]){
            this.state.itemName = GameData.Items[this.props.id].Name;
            this.state.itemDesc = GameData.Items[this.props.id].Desc;
        }
    }

    handleMouseHover = ((hover) => {
        this.setState({
            isHovered: hover
        });
    }).bind(this);

    handleMouseMove = ((event) => {
        this.setState({
            hoverX: event.clientX,
            hoverY: event.clientY
        })
    }).bind(this);

    render(){
        return (
            <div
              className="item"
              onMouseEnter={() => this.handleMouseHover(true)}
              onMouseLeave={() => this.handleMouseHover(false)}
              onMouseMove={this.handleMouseMove}
            >
                {this.state.itemName}
                <div
                  className="hover-block" 
                  style={{
                    display: this.state.isHovered ? "block" : "none",
                    top: this.state.hoverY + 5,
                    left: this.state.hoverX + 5
                  }}
                >
                    <h3>{this.state.itemName}</h3>
                    <p>{this.state.itemDesc}</p>
                </div>
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
        
        this.props.onSelection(num - 1);
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