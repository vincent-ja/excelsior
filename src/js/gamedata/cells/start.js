import { CellBase, registerCell } from "./base";

export class Start extends CellBase{
    onEnter(){
        return [
            "Welcome to Excelsior!/*/*Give the Spellbook a click to try out some things./*/*"
        ];
    }
}

registerCell(Start);