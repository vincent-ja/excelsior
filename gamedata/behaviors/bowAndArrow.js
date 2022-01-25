import _ from "lodash"

export var BowAndArrow = {
    AddedToInventory: (e) => {
        e.data.Damage = _.random(1, 10);
        e.data.Arrows = _.random(2, 8);
        e.api.runBehaviorCustom(e.data, 'Item', 'BowAndArrow.UpdateDesc');
    },
    UpdateDesc: (e) => {
        e.data.Desc = "A wooden bow and a quiver with " + e.data.Arrows + " arrows. Deals " + e.data.Damage + " impact damage. UID: " + e.data.Uid;
        e.api.updateItem(e.data);
    },
    HasArrows: (e, has = true) => {
        let hasArrow = (e.data.Arrows > 0);
        return has ? hasArrow : !hasArrow;
    },
    Shoot: (e) => {
        e.api.print([
            "You shot an arrow. There are now " + --e.data.Arrows + " arrows left in the [[quiver]]",
            {
                "Options": [
                    {"Name": "Check", "Click": ["BowAndArrow.CheckQuiver", e.data.Uid]}
                ]
            },
            "./*/*"
        ]);
        e.api.runBehaviorCustom(e.data, 'Item', 'BowAndArrow.UpdateDesc');

        let health = e.api.getStat("Health");
        health.Value-= e.data.Damage;
        e.api.updateStat(health);
    },
    CheckQuiver: (e, itemUid) => {
        e.data.Active = false;
        e.api.updateMeta(e.data);
        let item = e.api.getInventoryItem(itemUid);
        if(item !== undefined){
            e.api.print(["There are " + item.Arrows + " arrows in the quiver./*/*"]);
        } else {
            e.api.print(["The quiver is gone./*/*"]);
        }
    }
}