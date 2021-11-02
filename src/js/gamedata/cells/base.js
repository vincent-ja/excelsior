export var Cells = {};

export const registerCell = (cell) => {
    Cells[cell.name] = cell;
}

export class CellBase{

}