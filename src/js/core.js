import _ from "lodash";

export default class Core{
    static instance = null;

    static setInstance(inst, gameData){
        this.instance = inst;
        window.Excelsior = {
            Core: this,
            GameData: gameData
        };
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

    static addToInventory = (item) => {
        let uid = this.instance.addToInventory(item);
        item.AddedToInventory(item);
        return uid;
    }

    static print = (spans, actionDefs = []) => {
        let arr = [];
        let actions = [];

        for(let i = 0; i < spans.length; i++){
            let type = "none";
            let item = spans[i];

            if(spans[i].endsWith("/")){
                type = "line";
                item = item.substring(0, item.length - 1);
            } else if (spans[i].startsWith("[") && spans[i].endsWith("]")){
                type = "action";
                item = item.substring(1, item.length - 1);
                actions.push(arr.length);
            }

            arr.push({
                content: item,
                type: type
            });
        }

        for(let i = 0; i < actions.length; i++){
            arr[actions[i]].options = actionDefs[i];
        }

        this.instance.appendText(arr, "none");
    }

    static clear = () => {
        this.instance.clearText();
    }
}