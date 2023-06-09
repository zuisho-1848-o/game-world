import { Cell, CellType, CellStatus, cellTypeToName } from "./Cell";
import { Unit, UnitStatus, UnitType, unitTypeToName } from "./Unit";
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
    {
        type: UnitType.FootSoldier,
        maxHP: 10,
        mobility: 5,
        atk: 7,
        occupyPower: 1,
        range: 1,
        cost: 250,
        canAttackAfterMove: false,
        actionNumPerTurn: 1,
    }
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
        endurance: 3,
        trainableUnits: [UnitType.FootSoldier],
        turnIncome: 500
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
    cellInfoDiv: HTMLDivElement;
    institutionControlDiv: HTMLDivElement;
    turnDiv: HTMLDivElement;
    moneyDiv: HTMLDivElement;
    unitInfoDiv: HTMLDivElement;
    unitControlDiv: HTMLDivElement;
    unitData: UnitStatus[];
    cellData: CellStatus[];
    selectedCell?: Cell;
    selectedUnit?: Unit;
    movableCells: Cell[];
    attackableCells?: Cell[];
    playerColors: string[];
    playerNames: string[];


    constructor(canvasID: string, cellSize: number, cellInfoDivID: string, institutionControlDivID: string,
        moneyDivID: string, turnDivID: string, unitInfoDivID: string, unitControlDivID: string) {
        this.field = [[]];
        this.units = [];
        this.players = [];
        this.movableCells = [];

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

        this.cellInfoDiv = document.querySelector(cellInfoDivID) || document.createElement("div");
        this.institutionControlDiv = document.querySelector(institutionControlDivID) || document.createElement("div");
        this.moneyDiv = document.querySelector(moneyDivID) || document.createElement("div");
        this.turnDiv = document.querySelector(turnDivID) || document.createElement("div");
        this.unitInfoDiv = document.querySelector(unitInfoDivID) || document.createElement("div");
        this.unitControlDiv = document.querySelector(unitControlDivID) || document.createElement("div");

        this.unitData = defaultUnitData;
        this.cellData = defaultCellData;

        this.turn = 1;
        this.controlPlayer = 0;

        this.playerColors = ["blue", "red"];
        this.playerNames = ["青軍", "赤軍"];
    }


    init(map: GameMap, humanNum: number, unitData?: UnitStatus[], cellData?: CellStatus[]) {
        this.updateRowColumn(map.rowNum, map.columnNum);

        this.field = this.initField(map.field);
        this.units = [];
        this.movableCells = [];

        this.playerNum = map.playerNum;
        this.humanNum = humanNum;
        this.AINum = this.playerNum - this.humanNum;

        this.players = [];
        for(let i = 0; i < this.playerNum; i++) {
            this.players.push(new Player(i, map.firstMoney[i], true, this.playerColors[i], this.playerNames[i]));
        }

        if(unitData) {
            this.unitData = unitData;
        }

        if(cellData) {
            this.cellData = cellData;
        }

        this.selectedCell = this.field[0][0];
        this.handleCellSelect(this.selectedCell);
        this.updateMoney();
        this.updateTurn();

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
                    row.push(new Cell(j, i, cellType, cellStatus.moveCost, cellStatus.defBuff, fieldMapData[j][i].belong, cellStatus.supply, cellStatus.endurance, cellStatus.maxLevel, cellStatus.trainableUnits, cellStatus.turnIncome));
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

        for(let unit of this.units) {
            this.drawUnit(unit);
        }

        this.drawMovableArea();

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
        const cellCanvasTop = i * this.cellSize;

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
            console.error(`cannot draw invalid CellType "${cell.type}"`);
            // this.ctx.drawImage(this.images.flag, cellCanvasLeft, cellCanvasTop, this.cellSize, this.cellSize);
        }
    }

    drawUnit(unit: Unit) {
        const cellCanvasLeft = unit.xTemp * this.cellSize;
        const cellCanvasTop = unit.yTemp * this.cellSize;

        if(unit.type == UnitType.FootSoldier) {
            this.ctx.fillStyle = this.playerColors[unit.belong];
            const text = "歩";
            this.ctx.fillText(text, cellCanvasLeft + this.cellSize / 2, cellCanvasTop + this.cellSize / 2);
        } else {
            console.error(`cannot draw invalid UnitType "${unit.type}"`);
        }
    }

    drawMovableArea() {
        if(!this.movableCells) {
            return;
        }
        for(let cell of this.movableCells) {
            const {x, y} = cell;
            this.ctx.fillStyle = "rgba(255,255,255,0.3)";
            this.ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
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
        const selectedUnit = this.units.find(unit => unit.x == x && unit.y == y);
        if(selectedUnit) {
            this.handleUnitSelect(selectedUnit);
        } else if(this.selectedUnit &&  this.movableCells?.includes(this.selectedCell)) {
            this.selectedUnit.tempMove(x, y);
        } else {
            if(this.selectedUnit) {
                this.selectedUnit.cancelTempMove();
            }
            this.selectedUnit = undefined;
            this.movableCells = [];
            this.updateUnitInfo();
            this.updateUnitControl();
        }

        this.handleCellSelect(this.selectedCell);


    }

    handleUnitSelect(unit: Unit) {
        this.selectedUnit = unit;
        this.calcMovableCell();
        this.updateUnitInfo();
        this.updateUnitControl();
    }

    calcMovableCell() {
        // 一旦、moveCostを考えない実装。
        // moveCost はDPで実装か
        if(!this.selectedUnit) {
            return;
        }

        this.movableCells = [];

        const {x, y, mobility} = this.selectedUnit;
        for(let i = 0; i < this.rowNum; i++) {
            for(let j = 0; j < this.columnNum ;j++) {
                if(Math.abs(i-y) + Math.abs(j - x) <= mobility) {
                    this.movableCells?.push(this.field[i][j]);
                }
            }
        }
    }

    updateUnitInfo() {
        if(!this.selectedUnit) {
            this.unitInfoDiv.innerHTML = `<h2>ユニット情報</h2>`;
            return;
        }
        this.unitInfoDiv.innerHTML = `<h2>ユニット情報</h2><h3>${unitTypeToName(this.selectedUnit.type)}</h3>`
    }

    updateUnitControl() {
        if(!this.selectedUnit) {
            this.unitInfoDiv.innerHTML = ``;
            return;
        }

        this.unitControlDiv.innerHTML = `<h2>ユニット操作</h2>
        <ul class="unitControlUl">
            <li class="unitControlLi" data-control="stay">待機</li>
        </ul>`

    }

    handleCellSelect(selectedCell: Cell) {
        this.updateCellInfo(selectedCell);
        this.updateInstitutionControl(selectedCell);
    }

    updateCellInfo(selectedCell: Cell) {
        this.cellInfoDiv.innerHTML = `<h2>地点情報</h2>
        <h3>${cellTypeToName(selectedCell.type)}</h3>`
    }

    updateInstitutionControl(selectedCell?: Cell) {
        if(!selectedCell) {
            this.institutionControlDiv.innerHTML = ``;
            return;
        }

        const trainableUnits = selectedCell.getTrainableUnits();
        if(trainableUnits.length > 0 && selectedCell.belong == this.controlPlayer && this.checkCellHasUnitOfWhichPlayer(selectedCell) == -1) {
            const unitLis = [];
            for(let unitType of trainableUnits) {
                const unitCost = this.getUnitCost(unitType);
                unitLis.push(`<li class="trainUnitLi" data-type="${unitType}">
                    <div class="unitName">${unitTypeToName(unitType)}</div>
                    <div class="unitCost">${unitCost}円</div>
                </li>`)
            }
            this.institutionControlDiv.innerHTML = `<ul class="unitTrain">${unitLis.join("\n")}</ul>`;
        } else if(selectedCell.canLevelUp(1)) {
            // ここでレベルアップメニューを表示
            this.institutionControlDiv.innerHTML = ``;
        } else {
            this.institutionControlDiv.innerHTML = ``;
        }
    }


    getUnitCost(unitType: UnitType) {
        return this.getUnitStatus(unitType)?.cost;
    }

    getUnitStatus(unitType: UnitType) {
        const unitStatus = this.unitData.find(unitStatus => unitStatus.type == unitType);
        if(!unitStatus) {
            console.error(`unitCost を見つけられませんでした。 UnitType: ${unitType}`);
        }
        return unitStatus;
    }


    tryTraining(unitType: UnitType) {
        const status = this.getUnitStatus(unitType);
        if(!status) return;
        const selectedCell = this.selectedCell;
        if(!selectedCell) return;

        const {maxHP, type, mobility, atk, occupyPower, range, cost, canAttackAfterMove, actionNumPerTurn} = status;
        const player = this.players[this.controlPlayer];

        if(cost && cost < player.money) {
            const unit = new Unit(selectedCell?.x, selectedCell?.y, maxHP, type, mobility, atk, occupyPower, range, this.controlPlayer, cost, canAttackAfterMove, actionNumPerTurn)
            this.units.push(unit);

            unit.stay();
            player.money -= cost;
            this.updateMoney();
            this.updateInstitutionControl(this.selectedCell);

        }
    }


    checkCellHasUnitOfWhichPlayer(cell: Cell) {
        const {x, y} = cell;
        const unit = this.units.find(unit => unit.x == x && unit.y == y);
        if(unit) return unit.belong;
        return -1;
    }



    finishTurn() {
        this.controlPlayer += 1;
        if(this.controlPlayer >= this.playerNum) this.controlPlayer = 0;
        this.updateTurn();
    }


    startTurn() {

    }


    updateTurn() {
        let player = this.players[this.controlPlayer];
        this.turnDiv.innerHTML = `<span style="color: ${player.color}">${player.name} のターン</span>`
    }


    updateMoney() {
        this.moneyDiv.innerHTML = ``;
        for(let player of this.players) {
            this.moneyDiv.innerHTML += `<span style="color: ${player.color}">${player.name}: ${player.money}円</span>`
        }
    }


    unitStay() {
        if(!this.selectedUnit) {
            console.error(`selectedUnit が存在しないので "stay" できません`);
            return;
        }
        this.selectedUnit.moveFix();
        this.selectedUnit = undefined;
        this.movableCells = [];

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