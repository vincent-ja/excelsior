import _ from "lodash";
import _01 from "./data/cells01.json";

var Cells = {};
_.merge(Cells, _01);

export { Cells };
export * as CellBehaviors from "./behaviors";