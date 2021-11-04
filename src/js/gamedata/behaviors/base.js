import _ from "lodash";

export var AlwaysTrue = () => {
    return true;
}

export var AlwaysFalse = () => {
    return false;
}

export var GoTo = (e, cellName) => {
    e.api.gotoCell(cellName);
}

export var SetGloabl = (e, name, value) => {
    e.api.setGloabl(name, value);
}

export var GlobalEquals = (e, name, value) => {
    return e.api.getGloabl(name) === value;
}

export var AddToInventory = (e, itemName) => {
    e.api.addToInventory(itemName);
}

export var Self = {
    RemoveFromInventory: (e) => {
        if(_.has(e.data, 'Uid')){
            e.api.removeFromInventory(e.data.Uid);
        }
    }
}