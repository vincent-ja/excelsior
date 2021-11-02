import React from "react";
import { InventoryItem } from ".";

export class Inventory extends React.Component{
    renderItems(){
        if(typeof this.props.items != "object"){
            return;
        }

        const mappedItems = this.props.items.map((value) => {
            return (
                <InventoryItem key={value.Uid} item={value}/>
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