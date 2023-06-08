import { Cell, CellType, CellStatus } from "./Cell";
import { Unit, UnitStatus, UnitType } from "./Unit";
import { Player } from "./Player";


export interface GameMap {
    version: number;
    field: {cellType: CellType, belong: number}[][];
    units: {unitType: UnitType, belong: number, x: number, y: number}[];
    rowNum: number;
    columnNum: number;
    playerNum: number;
}


const defaultUnitData: UnitStatus[] = [

];

const defaultCellData: CellStatus[] = [
    {
        type: CellType.Plain,
        moveCost: 1,
        defBuff: 0
    }
];



export class Game {
    field: Cell[][];
    units: Unit[];
    turn: number;
    controlPlayer: number;
    players: Player[];
    rowNum: number;
    columnNum: number;
    cellSize: number;
    width: number;
    height: number;
    playerNum: number; // AIも入れた人数
    AINum: number;
    humanNum: number
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    unitData: UnitStatus[];
    cellData: CellStatus[];
    selectedCell?: Cell;
    selectedUnit?: Unit;
    movableCells?: Cell[];
    attackableCells?: Cell[];


    constructor(canvasID: string, cellSize: number) {
        this.field = [[]];
        this.units = [];
        this.players = [];

        this.playerNum = 2;
        this.AINum = 0;
        this.humanNum = 2;

        this.cellSize = cellSize;

        this.rowNum = 10;
        this.columnNum = 10;
        this.width = this.cellSize * this.columnNum;
        this.height = this.cellSize * this.rowNum;

        this.canvas = document.querySelector(canvasID) || document.createElement("canvas");
        this.updateRowColumn(10, 10);
        const ctx = this.canvas.getContext("2d");
        if(ctx) {
            this.ctx = ctx;
        } else {
            console.error("context を取得できませんでした。");
            // new Error("context を取得できませんでした。");
            this.ctx = null as unknown;
        }

        this.unitData = defaultUnitData;
        this.cellData = defaultCellData;

        this.turn = 1;
        this.controlPlayer = 0;
    }


    init(map: GameMap, humanNum: number, unitData?: UnitStatus[], cellData?: CellStatus[]) {
        this.updateRowColumn(map.rowNum, map.columnNum);

        this.field = this.initField(map.field);
        this.units = [];

        this.playerNum = map.playerNum;
        this.humanNum = humanNum;
        this.AINum = this.playerNum - this.humanNum;

        if(unitData) {
            this.unitData = unitData;
        }

        if(cellData) {
            this.cellData = cellData;
        }

        requestAnimationFrame(this.draw.bind(this));
    }

    initField(fieldMapData: {cellType: CellType, belong: number}[][]) {
        const field: Cell[][] = [];
        for(let i = 0; i < this.rowNum; i++) {
            const row = [];
            for(let j = 0; j < this.columnNum; j++) {
                const cellType = fieldMapData[j][i].cellType;
                const cellStatus: CellStatus | undefined = this.cellData.find(cell => cell.type == cellType);
                if(!cellStatus) {
                    console.error(`initField に失敗しました。理由： cellType "${cellType}" は無効です。`);
                } else {
                    row.push(new Cell(j, i, cellType, cellStatus.moveCost, cellStatus.defBuff));
                }
            }
            field.push(row);
        }

        return field;
    }


    save() {

    }

    load() {}



    draw() {
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.font = "20px serif";
        this.ctx.textAlign = 'center';

        for (let i = 0; i < this.rowNum; i++) {
            for (let j = 0; j < this.columnNum; j++) {
                this.drawCell(i, j);
            }
        }

        // if (this.gameState == "clear") {
        //     this.ctx.font = "100px serif";
        //     this.ctx.fillStyle = "blue";
        //     const text = "Clear"
        //     this.ctx.fillText(text, this.width / 2, this.height / 2);
        // } else if (this.gameState == "over") {
        //     this.ctx.font = "80px serif";
        //     this.ctx.fillStyle = "red";
        //     const text = "Game Over"
        //     this.ctx.fillText(text, this.width / 2, this.height / 2);
        // }

        requestAnimationFrame(this.draw.bind(this));

    }


    drawCell(i: number, j: number) {
        const cell = this.field[i][j];
        const cellCanvasLeft = j * this.cellSize;
        const cellCanvasTop = i * this.cellSize

        if (cell.type == "plain") {
            this.ctx.fillStyle = this.cellData.find(cell => cell.type == CellType.Plain)?.color || "green";
            this.ctx.fillRect(cellCanvasLeft, cellCanvasTop, this.cellSize, this.cellSize);

        } else {

            // this.ctx.drawImage(this.images.flag, cellCanvasLeft, cellCanvasTop, this.cellSize, this.cellSize);
        }
    }


    updateRowColumn(rowNum: number, columnNum: number) {
        this.rowNum = rowNum;
        this.columnNum = columnNum;

        this.width = this.cellSize * this.columnNum;
        this.height = this.cellSize * this.rowNum;

        // console.log(this.canvas);

        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.width = this.width + "px";
        this.canvas.style.height = this.height + "px";
    }

}