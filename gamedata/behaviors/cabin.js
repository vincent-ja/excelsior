export var Cabin = {
    Init: (e) => {
        e.api.registerStat("Health", 100, [0,250,0], 100);
        e.api.registerStat("Test2", 200, [100, 100, 100]);
        e.api.addToInventory("Spellbook");

        e.api.setGlobal("Cabin:BowTaken", false);
    },
    TakeBow: (e) => {
        e.api.addToInventory("Bow & Arrow");
        e.api.setGlobal("Cabin:BowTaken", true);
    },
    BowTaken: (e, isTrue = true) => {
        let taken = e.api.getGlobal("Cabin:BowTaken");
        return isTrue === taken;
    },
    InspectWardrobe: (e) => {
        e.api.print(["There is a bow & arrow in the wardrobe./*/*"]);
        console.log(e.data);
    }
};