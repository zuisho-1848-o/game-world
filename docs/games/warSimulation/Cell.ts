export enum CellType {
    Plain = "plain",
    City =  "city",
    Capital = "capital",
    Factory = "factory"
}

export interface CellStatus {
    type: CellType;
    moveCost: number;
    defBuff: number;
    color?: string;
    imagePath?: string;
}

export class Cell {
    x: number;
    y: number;
    type: CellType;
    moveCost: number;
    defBuff: number;

    constructor(x: number, y: number, type: CellType, moveCost: number, defBuff: number) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.moveCost = moveCost;
        this.defBuff = defBuff;
    }
}