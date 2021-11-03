import React from "react";
import Core from "../core";
import * as GameData from "../gamedata";
import { Inventory, GameText, Options } from ".";
import _ from "lodash";

export class GameContainer extends React.Component{
    state = {
        options: [
            "Continue walking",
            "Inspect the object"
        ],
        inventory: [],
        text: {
            text: "",
            meta: []
        }
    };

    nextUid = 0;

    componentDidMount(){
        if(Core.instance !== null){
            console.warn("There is more than one active GameContainer instance. Things may not work as expected.");
        }
        Core.setInstance(this, GameData);
        Core.addToInventory(Core.instantiate("Spellbook"));
        Core.gotoCell('Start');
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

    removeFromInventory = (uid) => {
        let inv = this.state.inventory.slice();
        let ind = inv.findIndex(x => x.Uid == uid);

        if(ind >= 0){
            inv.splice(ind, 1);
            this.setState({
                inventory: inv
            });
            return true;
        } else {
            return false;
        }
    }

    appendText = (arr) => {
        let newText = _.cloneDeep(this.state.text);

        for(let i = 0; i < arr.length; i++){
            if(typeof arr[i] === 'string'){
                newText.text = newText.text + arr[i];
            } else {
                newText.meta.push(arr[i]);
            }
        }
        
        this.setState({
            text: newText
        });
    }

    clearText = () => {
        this.setState({
            text: {
                text: "",
                meta: []
            }
        });
    }

    render(){
        return (
            <div className="game-container">
                <Inventory items={this.state.inventory}/>
                <GameText text={this.state.text.text} meta={this.state.text.meta}/>
                <Options list={this.state.options} onSelection={(e) => alert(e)}/>
            </div>
        );
    }
}