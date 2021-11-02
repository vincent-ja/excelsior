import React from "react";
import Core from "../core";
import * as GameData from "../gamedata";
import { Inventory, GameText, Options } from ".";

export class GameContainer extends React.Component{
    state = {
        options: [
            "Continue walking",
            "Inspect the object"
        ],
        inventory: [],
        text: []
    };

    nextUid = 0;

    componentDidMount(){
        if(Core.instance !== null){
            console.warn("There is more than one active GameContainer instance. Things may not work as expected.");
        }
        Core.setInstance(this, GameData);
        this.addToInventory(Core.instantiate(GameData.Items[0]));
    }

    componentWillUnmount(){
        Core.instance = null;
    }

    addToInventory = (item) => {
        let inv = this.state.inventory.slice();

        item.Uid = this.nextUid;
        inv.push(item);

        this.setState({
            inventory: inv
        });

        return this.nextUid++;
    }

    appendText = (arr) => {
        let newText = this.state.text.slice();
        newText.push(...arr);
        this.setState({
            text: newText
        });
    }

    clearText = () => {
        this.setState({
            text: []
        });
    }

    render(){
        return (
            <div className="game-container">
                <Inventory items={this.state.inventory}/>
                <GameText text={this.state.text}/>
                <Options list={this.state.options} onSelection={(e) => alert(e)}/>
            </div>
        );
    }
}