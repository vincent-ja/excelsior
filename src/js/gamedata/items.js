import _ from "lodash";
import Core from "../core";

var Items = {
    0: Core.newItem({
        Name: "Spellbook",
        Desc: "A book that contains many powerful spells.",
        Actions: [
            Core.newButton({
                Name: "Summon a Bow & Arrow",
                Click: (item) => {
                    Core.addToInventory(Core.instantiate(Items[1]));
                }
            })
        ]
    }),
    1: Core.newItem({
        Init: (item) => {
            item.Damage = _.random(1, 10);
            item.Arrows = _.random(2, 8);
            item.UpdateDesc(item);
        },
        AddedToInventory: (item) => {
            item.UpdateDesc(item);
        },
        Name: "Bow & Arrow",
        Actions: [
            Core.newButton({
                Name: "Inspect",
                Click: (item) => {
                    Core.print([
                        "There are " + item.Arrows + " arrows left in the quiver./*"
                    ]);
                }
            }),
            Core.newButton({
                Name: "Shoot",
                Condition: (item) => {
                    return(item.Arrows > 0);
                },
                Click: (item) => {
                    Core.print([
                        "You shot an arrow. There are now " + --item.Arrows + " arrows left in the quiver./*[[Shoot another?]]/*/*",
                        Core.newAction([
                            Core.newButton({
                                Name: "Yes",
                                Click: (action) => {
                                    item.Actions[1].Click(item);
                                    action.activate(false);
                                }
                            })
                        ])
                    ]);
                    item.UpdateDesc(item);
                }
            })
        ],
        Arrows: 0,
        Damage: 0,
        UpdateDesc: (item) => {
            item.Desc = "A wooden bow and a quiver with " + item.Arrows + " arrows. Deals " + item.Damage + " impact damage. UID: " + item.Uid;
        }
    })
}

export default Items;