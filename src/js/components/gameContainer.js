import React from "react";
import { Inventory, GameText, Options } from ".";

export class GameContainer extends React.Component{
    state = {
        options: [
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
        ],
        text: [
            {
                type: "none",
                content: ""
            }
        ]
    };

    addItem = (id) => {
        let inv = this.state.inventory.slice();
        inv.push({ id: id })
        this.setState({
            inventory: inv
        });
    }

    appendText = (arr) => {
        let newText = this.state.text.slice();
        newText.push(...arr);
        this.setState({
            text: newText
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