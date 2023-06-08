import { UnitType } from "./Unit";

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

    maxLevel?: number
    trainableUnits?: UnitType[];
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

    level: number;
    maxLevel: number;
    trainableUnits: UnitType[];

    constructor(x: number, y: number, type: CellType, moveCost: number, defBuff: number, belong: number, supply?: {
        army: number,
        navy: number,
        airForce: number
    }, endurance?: number, maxLevel?: number, trainableUnits?: UnitType[]) {
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

        this.level = 1;
        this.maxLevel = maxLevel || 1;
        this.trainableUnits = trainableUnits || [];
    }


    getTrainableUnits() {
        return this.trainableUnits;
    }


    levelUp(num: number = 1) {
        if(this.canLevelUp(num)) {
            this.level += num;
            return this.level;
        }

        return false;
    }


    canLevelUp(num: number = 1) {
        if(this.type != CellType.City) {
            return false;
        }

        if(this.level + num > this.maxLevel) {
            return false;
        }

        return true;
    }
}


export const cellTypeToName = (cellType: CellType) => {
    switch(cellType) {
        case CellType.Plain:
            return "草原";
        case CellType.Capital:
            return "首都";
        case CellType.City:
            return "街";
        case CellType.Factory:
            return "工場";
    }
}