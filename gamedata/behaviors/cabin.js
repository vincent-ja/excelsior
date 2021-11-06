export var Cabin = {
    Init: (e) => {
        e.api.registerStat("Health", 100, [0,250,0], 100);
    },
    TakeBow: (e) => {
        e.api.addToInventory("Bow & Arrow");
        e.api.setGlobal("Cabin:BowTaken", true);
    }
};