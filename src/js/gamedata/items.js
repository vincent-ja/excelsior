import Core from "../core";

var Items = {
    0: {
        Name: "Spellbook",
        Desc: "A book that contains many powerful spells.",
        Actions: {
            "Summon a Bow & Arrow": () => {
                Core.addItem(1);
            }
        }
    },
    1: {
        Name: "Bow & Arrow",
        Desc: "A wooden bow and a quiver full of arrows.",
        Actions: {
            "Inspect": (item) => {
                Core.print([
                    "There are " + item.Arrows + " arrows left in the quiver./"
                ]);
            },
            "Shoot": (item) => {
                item.Arrows -= 1;
                Core.print([
                    "You shot an arrow./"
                ]);
            }
        },
        Arrows: 5
    }
}

export default Items;