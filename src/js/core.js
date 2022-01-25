import _ from "lodash";
import * as GameData from "../../gamedata";

export default class Core{
    static instance = null;

    static state = {
        currentCell: "",
        initCells: [],
        nextUid: 0,
        globals: {},
        gameState: {
            options: {},
            inventory: [],
            text: {
                text: "",
                meta: []
            },
            stats: []
        }
    };

    static resetGame(){
        this.state = {
            currentCell: "",
            initCells: [],
            nextUid: 0,
            globals: {},
            gameState: {}
        };

        this.setGameState({
            options: {},
            inventory: [],
            text: {
                text: "",
                meta: []
            },
            stats: []
        });

        this.gotoCell("Start");
    }

    static registerStat(name, initialValue, color = [250,0,0], max = -1){
        let result = {
            Name: name,
            Value: initialValue,
            Color: color
        }
        if(max > -1){
            result.HasMax = true;
            result.Max = max;
        }

        let stats = _.cloneDeep(this.state.gameState.stats);
        stats.push(result);
        this.setGameState({stats: stats});
    }

    static updateStat(stat){
        let stats = _.cloneDeep(this.state.gameState.stats);
        let ind = stats.findIndex(x => x.Name == stat.Name);

        if(ind >= 0){
            stats[ind] = _.cloneDeep(stat);
            this.setGameState({
                stats: stats
            });
            return true;
        } else {
            return false;
        }
    }

    static getStat(name){
        return _.cloneDeep(this.state.gameState.stats.find(x => x.Name === name));
    }

    static setGlobal(name, value){
        this.state.globals[name] = value;
    }

    static getGlobal(name){
        if(_.has(this.state.globals, name)){
            return this.state.globals[name];
        } else {
            return undefined;
        }
    }

    static setInstance(inst){
        this.instance = inst;
        this.instance.state = _.cloneDeep(this.state.gameState);
        window['excelsior'] = this;
    }

    static setGameState(stateObj = {}){
        this.state.gameState = {...this.state.gameState, ..._.cloneDeep(stateObj)};
        this.instance.setState(stateObj);
    }

    static getFullState(){
        return JSON.stringify(this.state);
    }

    static setFullState(state){
        this.state = JSON.parse(state);
        this.setGameState(this.state.gameState);
    }

    static shorthandBehaviorToObj = (beh) => {
        if(Array.isArray(beh)){
            let result = {};
            let args = [];

            for(let i = 0; i < beh.length; i++){
                if(i === 0){
                    result["Behavior"] = beh[i];
                } else {
                    args.push(beh[i]);
                }
            }

            result["Args"] = args;
            return result;
        } else {
            return beh;
        }
    }

    static runBehavior = (inst, type, path, def = null) => {
        return this.runBehaviorBase(inst, inst, type, path, def);
    }

    static runBehaviorBase = (base, inst, type, path, def = null) => {
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
            let defObj = this.shorthandBehaviorToObj(_.get(base, path));
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
        if(_.has(GameData.Behaviors, behaviorDef)){
            let behavior = _.get(GameData.Behaviors, behaviorDef);
            return behavior({api: this, data: _.cloneDeep(inst), type: type}, ...args);
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
        let activeCell = _.cloneDeep(GameData.Cells[cell]);

        if(!this.state.initCells.includes(cell)){
            this.state.initCells.push(cell);
            this.runBehavior(activeCell, 'cell', 'Init');
        }
        
        this.clear();
        this.runBehavior(activeCell, 'cell', 'BeforeEnter');
        if(_.has(activeCell, 'Enter.Text')){
            this.print(activeCell.Enter.Text);
        }
        if(_.has(activeCell, 'Enter.Options')){
            this.setOptions(activeCell.Enter.Options, cell);
        } else {
            this.setOptions([], cell);
        }
        this.runBehavior(activeCell, 'cell', 'AfterEnter');
    }

    static addToInventory = (itemName) => {
        let item = _.cloneDeep(GameData.Items[itemName]);
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

    static getInventoryItem = (uid) => {
        return _.cloneDeep(this.state.gameState.inventory.find(x => x.Uid === uid));
    }

    static getMeta = (uid) => {
        return _.cloneDeep(this.state.gameState.text.meta.find(x => x.Uid === uid));
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

    static updateMeta = (meta) => {
        let newText = _.cloneDeep(this.state.gameState.text);
        let ind = newText.meta.findIndex(x => x.Uid == meta.Uid);

        if(ind >= 0){
            newText.meta[ind] = _.cloneDeep(meta);
            this.setGameState({
                text: newText
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
                arr[i].Uid = this.getUid();
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