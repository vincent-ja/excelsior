import _ from "lodash";

export default class Core{
    static GameData = {};
    static instance = null;

    static cellState = {};
    static currentCell = "";

    static behaviorTypes = [
        "Item",
        "Cell"
    ];

    static setInstance(inst, gameData){
        this.instance = inst;
        this.GameData = gameData;
        window['Excelsior'] = this;
    }

    static instantiate = (item) => {
        let inst = _.cloneDeep(this.GameData.Items[item]);
        this.runBehavior(inst, 'Item', 'Init');
        return inst;
    }

    static runBehavior = (inst, type, path, def = null) => {
        return this.runBehaviorBase(inst, inst, type, path, def);
    }

    static runBehaviorBase = (base, inst, type, path, def = null) => {
        if(!this.behaviorTypes.some(x => x === type) && type !== 'Unknown'){
            console.warn('"' + type + '" is not a valid behavior type.');
        }

        /* 
        Check if the base object has the property we're looking for.
        The property should be a behavior definition object.
        
        Behavior definition object:
        {
            "Behavior": (required) (A string representing the behavior path starting from GameData[(param:type) + "Behaviors"])
            "Args": (optional) (An array of additional arguments to pass to the behavior)
        }
        */
        if(_.has(base, path)){
            // If the property exists, get its value & check that it is a valid behavior definition object.
            let defObj = _.get(base, path);
            if(typeof defObj !== 'object'){
                console.warn('Behavior definition is not an object.');
                return def;
            }

            if(!_.has(defObj, 'Behavior')){
                console.warn('Behavior definition object has no "Behavior" property.');
                return def;
            }

            if(typeof defObj.Behavior !== 'string'){
                console.warn('Behavior definition "Behavior" property is not a string.');
                return def;
            }

            if(type === 'Unknown'){
                if(_.has(defObj, 'BehaviorType')){
                    let behvType = _.get(defObj, 'BehaviorType');
                    if(typeof behvType === 'string'){
                        if(this.behaviorTypes.some(x => x === behvType)){
                            type = behvType;
                        } else {
                            console.warn('"' + type + '" is not a valid behavior type.');
                            return def;
                        }
                    } else {
                        console.warn('Behavior definition "BehaviorType" property is not a string.');
                        return def;
                    }
                } else {
                    console.warn('Behavior definition of unknown type does not have a "BehaviorType" property.');
                    return def;
                }
            }

            let args = [];

            if(_.has(defObj, 'Args')){
                let argsTemp = _.get(defObj, 'Args');
                if(typeof argsTemp === 'object' && Array.isArray(argsTemp)){
                    args = argsTemp;
                } else {
                    console.warn('Behavior definition "Args" property is not an array.');
                    return def;
                }
            }

            return this.runBehaviorCustom(inst, type, defObj.Behavior, args, def);
        }

        return def;
    }

    static runBehaviorCustom = (inst, type, behaviorDef, args = [], def = null) => {
        if(!this.behaviorTypes.some(x => x === type)){
            console.warn('"' + type + '" is not a valid behavior type.');
            return def;
        }

        if(_.has(this.GameData[type + "Behaviors"], behaviorDef)){
            let behavior = _.get(this.GameData[type + "Behaviors"], behaviorDef);
            return behavior(inst, ...args);
        } else {
            console.warn('"' + behaviorDef + '" is not a valid "' + type + '" behavior.');
            return def;
        }
    }

    static getUid = () => {
        return this.instance.nextUid++;
    }

    static gotoCell = (cell) => {
        this.currentCell = cell;

        if(!_.has(this.cellState, cell)){
            this.cellState[cell] = _.cloneDeep(this.GameData.Cells[cell]);
        }
        
        this.clear();
        this.print(this.cellState[cell].Enter);
    }

    static getInventoryItem = (uid) => {
        return this.instance.state.inventory.find(x => x.Uid === uid);
    }

    static addToInventory = (item) => {
        let uid = this.instance.addToInventory(item);
        this.runBehavior(item, 'Item', 'AddedToInventory');
        return uid;
    }

    static removeFromInventory = (uid) => {
        return this.instance.removeFromInventory(uid);
    }

    static print = (arr) => {
        this.instance.appendText(arr);
    }

    static clear = () => {
        this.instance.clearText();
    }
}