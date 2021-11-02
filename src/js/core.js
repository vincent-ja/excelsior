import _ from "lodash";
import { Items } from "./gamedata";

export default class Core{
    static instance = null;

    static getItemInstance = (id) => {
        return _.cloneDeep(Items[id]);
    }

    static newItem = (item = {}) => {
        return _.defaultsDeep(item, {
            Name: "< Unknown >",
            Desc: "",
            Actions: {}
        });
    }

    static addToInventory = (item) => {
        this.instance.addToInventory(item);
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
}