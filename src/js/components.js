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
        menuOpen: false,
        menuX: 0,
        menuY: 0
    };

    wrapperRef = React.createRef();

    constructor(props){
        super(props);

        if(GameData.Items[this.props.id]){
            this.state.itemName = GameData.Items[this.props.id].Name;
            this.state.itemDesc = GameData.Items[this.props.id].Desc;
        }
    }

    handleMouseHover = (hover) => {
        this.setState({
            isHovered: hover
        });
    };

    handleMouseMove = (event) => {
        this.setState({
            hoverX: event.clientX,
            hoverY: event.clientY
        })
    };

    handleClick = (event) => {
        this.setState({
            menuOpen: true,
            menuX: event.clientX,
            menuY: event.clientY
        });
    };

    handleOutsideClick = (event) => {
        if(this.state.menuOpen && !this.wrapperRef.current.contains(event.target)){
            this.setState({
                menuOpen: false
            });
        }
    };

    componentDidMount(){
        document.addEventListener('click', this.handleOutsideClick);
    }

    componentWillUnmount(){
        document.removeEventListener('click', this.handleOutsideClick);
    }

    render(){
        return (
            <div ref={this.wrapperRef}>
                <div
                  className="item"
                  onMouseEnter={() => this.handleMouseHover(true)}
                  onMouseLeave={() => this.handleMouseHover(false)}
                  onMouseMove={this.handleMouseMove}
                  onClick={this.handleClick}
                >
                    {this.state.itemName}
                    <div
                      className="hover-block" 
                      style={{
                          display: (this.state.isHovered && !this.state.menuOpen) ? "block" : "none",
                          top: this.state.hoverY + 5,
                          left: this.state.hoverX + 5
                      }}
                    >
                        <h3>{this.state.itemName}</h3>
                        <p>{this.state.itemDesc}</p>
                    </div>
                </div>
                <div
                  className="menu"
                  style={{
                      display: this.state.menuOpen ? "block" : "none",
                      top: this.state.menuY,
                      left: this.state.menuX
                  }}
                >
                    <div>Inspect</div>
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
    handleKeyDown = (e) => {
        if(!isNaN(e.key)){
            this.handleSelection(e.key)
        }
    };

    componentDidMount(){
        document.addEventListener('keydown', this.handleKeyDown);
    }

    componentWillUnmount(){
        document.removeEventListener('keydown', this.handleKeyDown);
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