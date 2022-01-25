export var Cabin = {
    Init: (e) => {
        e.api.registerStat("Health", 100, [0,250,0], 100);
        e.api.setGlobal("Cabin:SpellbookTaken", false);
    },
    TakeSpellbook: (e) => {
        e.api.addToInventory("Spellbook");
        e.api.setGlobal("Cabin:SpellbookTaken", true);
    },
    InspectWardrobe: (e) => {
        e.api.print(["There is a [[Spellbook]] in the wardrobe./*/*", {
            "Condition": ["GlobalEquals", "Cabin:SpellbookTaken", false],
            "Options": [
                {
                    "Name": "Pick Up",
                    "Click": ["Cabin.TakeSpellbook"]
                }
            ]
        }]);
    }
};