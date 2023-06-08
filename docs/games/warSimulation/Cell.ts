
export enum CellType {
    Plain = "plain",
    City = "city",
    Capital = "capital",
    Factory = "factory"
}

export interface CellStatus {
    type: CellType;
    moveCost: number;
    defBuff: number;

    color?: string;
    imagePath?: string;

    supply?: {
        army: number,
        navy: number,
        airForce: number
    };
    endurance?: number;
}

export class Cell {
    x: number;
    y: number;
    type: CellType;
    moveCost: number;
    defBuff: number;

    belong: number;
    // 補給力, 占領率, 耐久力
    supply: {
        army: number,
        navy: number,
        airForce: number
    };
    endurance: number;
    occupationRate: number;

    constructor(x: number, y: number, type: CellType, moveCost: number, defBuff: number, belong: number, supply?: {
        army: number,
        navy: number,
        airForce: number
    }, endurance?: number) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.moveCost = moveCost;
        this.defBuff = defBuff;

        this.belong = belong;
        this.supply = supply || {
            army: 0,
            navy: 0,
            airForce: 0
        };
        this.endurance = endurance || 0;

        this.occupationRate = 0;
    }
}