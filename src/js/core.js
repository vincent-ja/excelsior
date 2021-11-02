import _ from "lodash";

export default class Core{
    static instance = null;
    static visitedCells = {};
    static currentCell = null;

    static GameData = {};

    static setInstance(inst, gameData){
        this.instance = inst;
        this.GameData = gameData;
        window['Excelsior'] = this;
    }

    static instantiate = (item) => {
        let inst = _.cloneDeep(item);
        inst.Init(inst);
        return inst;
    }

    static newItem = (item) => {
        return _.defaults(item, {
            Init: () => {},
            AddedToInventory: () => {},
            Name: "[Undefined]",
            Desc: "",
            Actions: {}
        });
    }

    static newButton = (menuItem) => {
        return _.defaults(menuItem, {
            Name: "[Undefined]",
            Condition: () => { return true; },
            Click: () => {}
        });
    }

    static newAction = (options) => {
        return {
            Uid: this.instance.nextUid++,
            Options: options
        };
    }

    static gotoCell = (cell) => {
        if(this.currentCell !== null){
            this.visitedCells[this.currentCell.name] = _.cloneDeep(this.currentCell);
        }
        if(_.has(this.visitedCells, cell.name)){
            this.currentCell = this.visitedCells[cell.name];
        } else {
            this.currentCell = new cell();
        }
        this.clear();
        this.print(this.currentCell.onEnter());
    }

    static addToInventory = (item) => {
        let uid = this.instance.addToInventory(item);
        item.AddedToInventory(item);
        return uid;
    }

    static print = (arr) => {
        this.instance.appendText(arr);
    }

    static clear = () => {
        this.instance.clearText();
    }
}