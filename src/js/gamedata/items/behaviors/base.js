import _ from "lodash";

export var Base = {
    RemoveFromInventory: (item) => {
        if(_.has(item, 'Uid')){
            Excelsior.removeFromInventory(item.Uid);
        }
    }
}