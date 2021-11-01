import * as Core from "../core";

var Items = {
    0: {
        Name: "Spellbook",
        Desc: "A book that contains many powerful spells.",
        Actions: {
            "Summon a Bow & Arrow": () => Core.addItem(1)
        }
    },
    1: {
        Name: "Bow & Arrow",
        Desc: "A wooden bow and a quiver full of arrows.",
        Actions: {
            "Inspect": () => Core.print("A trusty bow and arrow.")
        }
    }
}

export default Items;