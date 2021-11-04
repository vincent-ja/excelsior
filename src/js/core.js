import _ from "lodash";

export default class Core{
    static GameData = {};
    static instance = null;

    static state = {
        currentCell: "",
        cellState: {},
        nextUid: 0,
        globals: {},
        gameState: {
            options: {},
            inventory: [],
            text: {
                text: "",
                meta: []
            }
        }
    };

    static behaviorTypes = [
        "Item",
        "Cell"
    ];

    static setInstance(inst, gameData){
        this.instance = inst;
        this.GameData = gameData;
        this.instance.state = _.cloneDeep(this.state.gameState);
        window['Excelsior'] = this;
    }

    static setGameState(stateObj = {}){
        this.state.gameState = {...this.state.gameState, ..._.cloneDeep(stateObj)};
        this.instance.setState(stateObj);
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
            return behavior(_.cloneDeep(inst), ...args);
        } else {
            console.warn('"' + behaviorDef + '" is not a valid "' + type + '" behavior.');
            return def;
        }
    }

    static getUid = () => {
        return this.state.nextUid++;
    }

    static gotoCell = (cell) => {
        this.state.currentCell = cell;

        if(!_.has(this.state.cellState, cell)){
            this.state.cellState[cell] = _.cloneDeep(this.GameData.Cells[cell]);
        }
        
        this.clear();
        this.print(this.state.cellState[cell].Enter.Text);
        this.setOptions(this.state.cellState[cell].Enter.Options, cell);
    }

    static getInventoryItem = (uid) => {
        return _.cloneDeep(this.state.gameState.inventory.find(x => x.Uid === uid));
    }

    static addToInventory = (itemName) => {
        let item = _.cloneDeep(this.GameData.Items[itemName]);
        let inv =  _.cloneDeep(this.state.gameState.inventory);
        let uid = this.getUid();

        item.Uid = uid;
        inv.push(item);

        this.setGameState({
            inventory: inv
        });

        this.runBehavior(item, 'Item', 'AddedToInventory');
        return uid;
    }

    static updateItem = (item) => {
        let inv = _.cloneDeep(this.state.gameState.inventory);
        let ind = inv.findIndex(x => x.Uid == item.Uid);

        if(ind >= 0){
            inv[ind] = _.cloneDeep(item);
            this.setGameState({
                inventory: inv
            });
            return true;
        } else {
            return false;
        }
    }

    static removeFromInventory = (uid) => {
        let inv = _.cloneDeep(this.state.gameState.inventory);
        let ind = inv.findIndex(x => x.Uid == uid);

        if(ind >= 0){
            inv.splice(ind, 1);
            this.setGameState({
                inventory: inv
            });
            return true;
        } else {
            return false;
        }
    }

    static print = (arr) => {
        let newText = _.cloneDeep(this.state.gameState.text);

        for(let i = 0; i < arr.length; i++){
            if(typeof arr[i] === 'string'){
                newText.text = newText.text + arr[i];
            } else {
                newText.meta.push(arr[i]);
            }
        }

        this.setGameState({
            text: newText
        });
    }

    static clear = () => {
        this.setGameState({
            text: {
                text: "",
                meta: []
            }
        });
    }

    static setOptions = (opts, cellName) => {
        this.setGameState({
            options: { "Cell": cellName,  "Options": opts}
        });
    }
}