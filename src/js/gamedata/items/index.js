import _ from "lodash";
import _01 from "./data/items01.json";

var Items = {};
_.merge(Items, _01);

export { Items };
export * as ItemBehaviors from "./behaviors";