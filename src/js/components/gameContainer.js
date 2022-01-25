import React from "react";
import Core from "../core";
import { Inventory, GameText, Options, Stats } from ".";

export class GameContainer extends React.Component{
    constructor(){
        super();
        if(Core.instance !== null){
            console.warn("There is more than one active GameContainer instance. Things may not work as expected.");
        }
        Core.setInstance(this);
    }

    componentDidMount(){
        Core.resetGame();
    }

    componentWillUnmount(){
        Core.instance = null;
    }

    render(){
        return (
            <div className="game-container">
                <Inventory items={this.state.inventory}/>
                <GameText text={this.state.text.text} meta={this.state.text.meta}/>
                <Options list={this.state.options}/>
                <Stats list={this.state.stats}/>
            </div>
        );
    }
}