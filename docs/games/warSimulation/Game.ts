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
    firstMoney: number[];
}


const defaultUnitData: UnitStatus[] = [

];

const defaultCellData: CellStatus[] = [
    {
        type: CellType.Plain,
        moveCost: 1,
        defBuff: 0
    },
    {
        type: CellType.Capital,
        moveCost: 1,
        defBuff: 3,
        supply: {
            army: 3,
            navy: 0,
            airForce: 0
        },
        endurance: 3
    },

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
    playerColors: string[];


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

        this.playerColors = ["blue", "red"];
    }


    init(map: GameMap, humanNum: number, unitData?: UnitStatus[], cellData?: CellStatus[]) {
        this.updateRowColumn(map.rowNum, map.columnNum);

        this.field = this.initField(map.field);
        this.units = [];

        this.playerNum = map.playerNum;
        this.humanNum = humanNum;
        this.AINum = this.playerNum - this.humanNum;

        this.players = [];
        for(let i = 0; i < this.playerNum; i++) {
            this.players.push(new Player(i, map.firstMoney[i], true, this.playerColors[i]));
        }

        if(unitData) {
            this.unitData = unitData;
        }

        if(cellData) {
            this.cellData = cellData;
        }

        this.selectedCell = this.field[0][0];

        this.canvas.addEventListener("click", (e) => {
            const { canvasX, canvasY } = this.clickEventToCanvasXY(e);
            this.handleClick(canvasX, canvasY);
        })

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
                    row.push(new Cell(j, i, cellType, cellStatus.moveCost, cellStatus.defBuff, fieldMapData[j][i].belong));
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

        this.drawActiveCell();

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

        if (cell.type == CellType.Plain) {
            this.ctx.fillStyle = this.cellData.find(cell => cell.type == CellType.Plain)?.color || "green";
            this.ctx.fillRect(cellCanvasLeft, cellCanvasTop, this.cellSize, this.cellSize);

        } else if(cell.type == CellType.Capital) {
            this.ctx.fillStyle = "white";
            this.ctx.fillRect(cellCanvasLeft, cellCanvasTop, this.cellSize, this.cellSize);

            this.ctx.fillStyle = "gray";
            // console.log(cell.belong);
            if(cell.belong >= 0) {
                const color = this.playerColors[cell.belong];
                if(color) {
                    this.ctx.fillStyle = color;
                }
            }
            const text = "首"
            this.ctx.fillText(text, cellCanvasLeft + this.cellSize / 2, cellCanvasTop + this.cellSize / 2);
        } else {

            // this.ctx.drawImage(this.images.flag, cellCanvasLeft, cellCanvasTop, this.cellSize, this.cellSize);
        }
    }

    drawActiveCell() {
        this.ctx.strokeStyle = "yellow";
        if(this.selectedCell) {
            this.ctx.strokeRect(this.selectedCell.x * this.cellSize, this.selectedCell.y * this.cellSize, this.cellSize, this.cellSize);
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


    handleClick(posX: number, posY: number) {

        const x = Math.floor(posX / this.cellSize);
        const y = Math.floor(posY / this.cellSize);

        // console.log(x, y);

        this.selectedCell = this.field[y][x];

    }


    clickEventToCanvasXY(e: MouseEvent) {
        const rect = e.target?.getBoundingClientRect();

        // ブラウザ上での座標を求める
        const viewX = e.clientX - rect.left;
        const viewY = e.clientY - rect.top;

        // 表示サイズとキャンバスの実サイズの比率を求める
        const scaleWidth = this.canvas.clientWidth / this.canvas.width;
        const scaleHeight = this.canvas.clientHeight / this.canvas.height;

        // ブラウザ上でのクリック座標をキャンバス上に変換
        const canvasX = Math.floor(viewX / scaleWidth);
        const canvasY = Math.floor(viewY / scaleHeight);

        return { canvasX, canvasY };
    }

}