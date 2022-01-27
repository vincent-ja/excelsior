export var Cabin = {
    Init: (e) => {
        e.api.registerStat("Health", 100, [0,250,0], 100);
        e.api.setGlobal("Cabin:SpellbookTaken", false);
        e.api.setGlobal("Cabin:WardrobeInspected", false);
    },
    TakeSpellbook: (e) => {
        e.api.addToInventory("Spellbook");
        e.api.setGlobal("Cabin:SpellbookTaken", true);
    },
    InspectWardrobe: (e) => {
        e.api.print(["The large wardrobe has a [[spellbook]] inside of it./*/*", {
            "Condition": ["GlobalEquals", "Cabin:SpellbookTaken", false],
            "Options": [
                {
                    "Name": "Pick Up",
                    "Click": ["Cabin.TakeSpellbook"]
                }
            ]
        }]);
        e.api.setGlobal("Cabin:WardrobeInspected", true);
    }
};