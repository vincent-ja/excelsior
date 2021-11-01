import React from "react";
import { InventoryItem } from ".";

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