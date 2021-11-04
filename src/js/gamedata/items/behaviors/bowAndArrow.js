import _ from "lodash"

export var BowAndArrow = {
    AddedToInventory: (item) => {
        item.Damage = _.random(1, 10);
        item.Arrows = _.random(2, 8);
        Excelsior.runBehaviorCustom(item, 'Item', 'BowAndArrow.UpdateDesc');
    },
    UpdateDesc: (item) => {
        item.Desc = "A wooden bow and a quiver with " + item.Arrows + " arrows. Deals " + item.Damage + " impact damage. UID: " + item.Uid;
        Excelsior.updateItem(item);
    },
    HasArrows: (item, has = true) => {
        let hasArr = (item.Arrows > 0);
        return has ? hasArr : !hasArr;
    },
    Shoot: (item) => {
        Excelsior.print([
            "You shot an arrow. There are now " + --item.Arrows + " arrows left in the [[quiver]]",
            {
                "Options": [
                    {
                        "Name": "Check",
                        "Click": {
                            "BehaviorType": "Item",
                            "Behavior": "BowAndArrow.CheckQuiver",
                            "Args": [ item.Uid ]
                        }
                    }
                ]
            },
            "./*/*"
        ]);
        Excelsior.runBehaviorCustom(item, 'Item', 'BowAndArrow.UpdateDesc');
    },
    CheckQuiver: (action, itemUid) => {
        action.activate(false);
        let item = Excelsior.getInventoryItem(itemUid);
        if(item !== undefined){
            Excelsior.print(["There are " + item.Arrows + " arrows in the quiver./*/*"]);
        } else {
            Excelsior.print(["The quiver is gone./*/*"]);
        }
    }
}