const msToSecond = (ms) => {
    return Math.floor(ms / 1000);
}

const pickN = (min, max, n) => {
    const list = new Array(max - min + 1).fill().map((_, i) => i + min);
    const ret = [];
    while (n--) {
        const rand = Math.floor(Math.random() * (list.length + 1)) - 1;
        ret.push(...list.splice(rand, 1))
    }
    return ret;
}



class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.hasBomb = false;
        this.SurroundBombNum = -1;

        this.state = "close" // "open", "flag", "bomb"
    }

    tryOpen() {
        if (this.state == "close") {
            this.state = "open";
            return true;
        } else {
            console.log(`you can open only the state "close" cell. this cell is "${this.state}"`);
            return false;
        }
    }

    /**
     * 設置成功→"set", 削除成功→"remove", 失敗→false を返す。
     */
    tryToggleFlag() {
        if (this.state == "close") {
            this.state = "flag";
            return "set";
        } else if(this.state == "flag") {
            this.state = "close";
            return "remove";
        } else {
            console.log(`you can set flag on only the state "close" cell. this cell is "${this.state}"`);
            return false;
        }
    }
}



class Game {
    constructor(rowNum, columnNum, bombNum, canvasID, cellSize, flagNumSpanID, bombNumSpanID, timeSpanID, searchModeInputID, flagModeInputID) {
        this.images = {};
        // 非同期だからロードを待った方がいいかも。
        this.loadImages();

        this.canvas = document.querySelector(canvasID);
        this.ctx = this.canvas.getContext("2d");

        this.rowNum = rowNum;
        this.columnNum = columnNum;
        this.bombNum = bombNum;
        this.cellSize = cellSize;

        this.width = cellSize * columnNum;
        this.height = cellSize * rowNum;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.width = this.width + "px";
        this.canvas.style.height = this.height + "px";


        this.gameState = "ready" // "run", "clear", "over"
        this.cursorType = "search" // "flag";
        this.flagNum = 0;
        this.time = 0;

        this.closeColor = ["#88ff88", "#66dd66"];
        // this.openColor = ["#E19661", "#806C68"];
        this.openColor = ["#d6b899", "#e5c19f"];


        this.flagNumSpan = document.querySelector(flagNumSpanID);
        this.bombNumSpan = document.querySelector(bombNumSpanID);
        this.timeSpan = document.querySelector(timeSpanID);
        this.flagModeInput = document.querySelector(flagModeInputID);
        this.searchModeInput = document.querySelector(searchModeInputID);

        this.bombNumSpan.innerHTML = bombNum;
    }


    restart(rowNum, columnNum, bombNum, cellSize) {
        // cancelAnimationFrame(this.animationFrameID);
        clearInterval(this.calcTimeIntervalID);

        this.rowNum = rowNum;
        this.columnNum = columnNum;
        this.bombNum = bombNum;
        this.cellSize = cellSize;

        this.width = cellSize * columnNum;
        this.height = cellSize * rowNum;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.width = this.width + "px";
        this.canvas.style.height = this.height + "px";

        this.gameState = "ready" // "run", "clear", "over"
        this.cursorType = "search" // "flag";

        this.flagNum = 0;
        this.time = 0;

        this.field = this.initField();
        // this.animationFrameID = requestAnimationFrame(this.update.bind(this));
    }


    init() {
        // field[y][x] でアクセス。
        this.field = this.initField();
        this.animationFrameID = requestAnimationFrame(this.update.bind(this));
        this.canvas.addEventListener("click", (e) => {
            const { canvasX, canvasY } = this.mouseEventToCanvasXY(e);
            this.handleClick(canvasX, canvasY);
        })
    }

    initField() {
        const field = [];
        for (let i = 0; i < this.rowNum; i++) {
            const row = [];
            for (let j = 0; j < this.columnNum; j++) {
                row.push(new Cell(j, i));
            }
            field.push(row);
        }

        return field;
    }

    loadImages() {
        this.images.bomb = new Image();
        this.images.bomb.src = "assets/images/bomb_trans.png";

        this.images.flag = new Image();
        this.images.flag.src = "assets/images/flag_trans.png";

        this.images.close = new Image();
        this.images.close.src = "assets/images/close.png";

        this.images.num = {};
        for(let i = 1; i <= 8; i++) {
            this.images.num["" + i] = new Image();
            this.images.num["" + i].src = `assets/images/${i}.png`;
        }
    }


    mouseEventToCanvasXY(e) {
        const rect = e.target.getBoundingClientRect();

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

    start(clickedCellRow, clickedCellColumn) {
        if (this.gameState != "ready") {
            console.error(`game is not ready. state is ${this.gameState}`);
            return;
        }

        console.log("start");

        this.createField(clickedCellRow, clickedCellColumn);
        this.startTime = new Date().getTime();
        this.time = 0;
        this.flagNum = 0;
        this.calcTimeIntervalID = setInterval(this.calcTime.bind(this), 200);
        this.gameState = "run";
    }

    calcTime() {
        this.time = new Date().getTime() - this.startTime;
    }

    createField(clickedCellRow, clickedCellColumn) {
        this.setBomb(clickedCellRow, clickedCellColumn);
        this.setSurroundBombNum();
        console.log(this.field.map(row => {
            return row.map(cell => {
                if (cell.hasBomb) return "b";
                return cell.SurroundBombNum;
            })
        }));
    }

    setBomb(clickedCellRow, clickedCellColumn) {
        const clickedCellNum = clickedCellRow * this.columnNum + clickedCellColumn;
        console.log(clickedCellNum);
        const randInts = pickN(0, this.rowNum * this.columnNum - 2, this.bombNum);

        for (let randInt of randInts) {
            if (randInt >= clickedCellNum) randInt++;
            const y = Math.floor(randInt / this.columnNum);
            const x = randInt % this.columnNum;

            // console.log(`setBomb x: ${x}, ${y}`);

            this.field[y][x].hasBomb = true;
        }
    }

    setSurroundBombNum() {
        for (let i = 0; i < this.rowNum; i++) {
            for (let j = 0; j < this.columnNum; j++) {
                const cell = this.field[i][j];
                if (cell.hasBomb) continue;

                cell.SurroundBombNum = this.countSurroundBomb(i, j);
            }
        }
    }


    // i → y 座標、j → x 座標
    countSurroundBomb(i, j) {
        const surroundCells = this.getSurroundCells(i, j);
        let num = 0;
        for (let cell of surroundCells) {
            if (cell.hasBomb) num++;
        }

        return num;
    }


    // i → y 座標、j → x 座標
    getSurroundCells(i, j) {
        let cells = []
        for (let y_dis = -1; y_dis <= 1; y_dis++) {
            const y = i + y_dis;
            if (y < 0 || y >= this.rowNum) continue;

            for (let x_dis = -1; x_dis <= 1; x_dis++) {
                if (y_dis == 0 && x_dis == 0) continue;

                const x = j + x_dis;
                if (x < 0 || x >= this.columnNum) continue;


                cells.push(this.field[y][x]);
            }
        }
        return cells;
    }


    gameClear() {
        console.log("Game Clear");
        this.gameState = "clear";
        clearInterval(this.calcTimeIntervalID);
    }

    gameOver() {
        console.log("Game Over");
        this.gameState = "over";
        clearInterval(this.calcTimeIntervalID);
    }


    update() {
        this.draw();
        this.updateFlagNum();
        this.updateTime();

        requestAnimationFrame(this.update.bind(this))
    }

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

        if (this.gameState == "clear") {
            this.ctx.fillStyle = "rgba(0,0,0,0.3)";
            this.ctx.fillRect(0, 0, this.width, this.height);

            this.ctx.font = "100px serif";
            this.ctx.fillStyle = "#5ce1e6";
            const text = "Clear"
            this.ctx.fillText(text, this.width / 2, this.height / 2);
        } else if (this.gameState == "over") {
            this.ctx.fillStyle = "rgba(0,0,0,0.3)";
            this.ctx.fillRect(0, 0, this.width, this.height);

            this.ctx.font = "80px serif";
            this.ctx.fillStyle = "#ff5555";
            const text = "Game Over"
            this.ctx.fillText(text, this.width / 2, this.height / 2);
        } else {
            if(this.hoverCell) {
                const {x, y} = this.hoverCell;
                this.ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
                this.ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
            }
        }

        // requestAnimationFrame(this.draw.bind(this));

    }


    drawCell(i, j) {
        const cell = this.field[i][j];
        const cellCanvasLeft = j * this.cellSize;
        const cellCanvasTop = i * this.cellSize

        if (cell.state == "open" || cell.state == "bomb") {
            this.ctx.fillStyle = this.openColor[(+i + j) % 2];
            this.ctx.fillRect(cellCanvasLeft, cellCanvasTop, this.cellSize, this.cellSize);

            if(cell.state == "bomb") {
                this.ctx.drawImage(this.images.bomb, cellCanvasLeft, cellCanvasTop, this.cellSize, this.cellSize);
                return;
            }

            let text = cell.SurroundBombNum;
            if (text == 0) return;

            // this.ctx.fillStyle = "black";
            // this.ctx.fillText(text, cellCanvasLeft + Math.floor(this.cellSize / 2), Math.floor(cellCanvasTop + this.cellSize / 2));
            this.ctx.drawImage(this.images.num["" + text], cellCanvasLeft, cellCanvasTop, this.cellSize, this.cellSize);
        } else {
            // this.ctx.fillStyle = this.closeColor[(+i + j) % 2];
            // this.ctx.fillRect(cellCanvasLeft, cellCanvasTop, this.cellSize, this.cellSize);
            this.ctx.drawImage(this.images.close, cellCanvasLeft, cellCanvasTop, this.cellSize, this.cellSize);

            if(cell.state == "flag") {
                // this.ctx.fillStyle = "black";
                // this.ctx.fillText("f", cellCanvasLeft + Math.floor(this.cellSize / 2), Math.floor(cellCanvasTop + this.cellSize / 2));
                this.ctx.drawImage(this.images.flag, cellCanvasLeft, cellCanvasTop, this.cellSize, this.cellSize);
            }
        }
    }

    updateTime() {
        const second = msToSecond(this.time);
        if(second > 999) second = 999;
        this.timeSpan.innerHTML = ("000" + second).slice(-3);
    }

    updateFlagNum() {
        this.flagNumSpan.innerHTML = this.flagNum;
    }


    handleClick(posX, posY) {

        if (this.gameState == "clear" || this.gameState == "over") {
            console.log("cannot click. game is not running");
            return;
        }

        const {x, y} = this.posXYToCellXY(posX, posY);

        if (this.gameState == "ready") {
            this.start(y, x);
        }

        if (this.gameState == "run") {
            console.log(x, y);

            this.tryOpenOrToggleFlagCell(x, y);
        }
    }

    posXYToCellXY(posX, posY) {
        const x = Math.floor(posX / this.cellSize);
        const y = Math.floor(posY / this.cellSize);
        return {x, y};
    }


    tryOpenOrToggleFlagCell(x, y) {
        const cell = this.field[y][x];
        if (this.mode == "flag") {
            const result = cell.tryToggleFlag();
            if(result == "set") {
                this.flagNum += 1;
            } else if(result == "remove") {
                this.flagNum -= 1;
            }
            return;
        }

        if (cell.hasBomb) {
            this.gameOver();
            cell.state = "bomb";
            return;
        }

        const result = cell.tryOpen();

        if (result) {
            // this.autoOpen()
            this.tryOpenNeighbor(x, y);
        }

        if (this.clearCheck()) {
            this.gameClear();
            return;
        }
    }


    /**
     * 確定で開くセル（0と隣接している）を開く
     */
    tryOpenNeighbor(x, y) {
        if (this.field[y][x].SurroundBombNum == 0) {
            this.getSurroundCells(y, x).forEach(cell => {
                if (cell.state != "close") return;
                cell.tryOpen();
                if (cell.SurroundBombNum == 0) {
                    this.tryOpenNeighbor(cell.x, cell.y);
                }
            })
        }
    }

    /**
     * 確定で開くセル（0と隣接している）を開く
     * これだと、クリック位置に関係なく開いてしまう。
     */
    // autoOpen() {
    //     for (let i = 0; i < this.rowNum; i++) {
    //         for (let j = 0; j < this.columnNum; j++) {
    //             if(this.getSurroundCells(i, j).some(cell => cell.SurroundBombNum == 0)) {
    //                 this.field[i][j].open()
    //             }
    //         }
    //     }
    // }

    clearCheck() {
        for (let i = 0; i < this.rowNum; i++) {
            for (let j = 0; j < this.columnNum; j++) {
                const cell = this.field[i][j];
                if (!cell.hasBomb && cell.state != "open") return false;
            }
        }

        return true;
    }

    changeMode(mode) {
        if (mode == "search") {
            console.log(`change mode to search`);
            this.mode = "search";
            this.searchModeInput.checked = true;
        } else if ("flag") {
            this.mode = "flag";
            console.log(`change mode to flag`);
            this.flagModeInput.checked = true;
        } else {
            console.error(`invalid mode: ${mode}`);
        }
    }


}


const rowNum = 10;
const columnNum = 10;
const bombNum = 10;
const cellSize = 500 / rowNum;

const game = new Game(rowNum, columnNum, bombNum, "#gameCanvas", cellSize, "#flagNum", "#bombNum", "#time", "#searchMode", "#flagMode");
game.init();



const radioBtns = document.querySelectorAll(`input[type='radio'][name='modeRadio']`);

for (let target of radioBtns) {
    target.addEventListener(`change`, () => {
        if (target.checked && target.value == "search") {
            game.changeMode("search");
        } else if (target.checked && target.value == "flag") {
            game.changeMode("flag");
        } else {
            console.error(`cannot change mode target.value: ${target.value}`);
        }
    });
}


const columnNumInput = document.querySelector("#columnNum");
const rowNumInput = document.querySelector("#rowNum");
const bombNumInput = document.querySelector("#bomNum");
const restartBtn = document.querySelector("#restartBtn");


document.addEventListener("keyup", (e) => {
    if(e.key == "f") {
        game.changeMode("flag");
    } else if(e.key == "s") {
        game.changeMode("search");
    } else if(e.key == "r") {
        restartBtn.click();
    }
})




restartBtn.addEventListener("click", () => {
    let columnNum = Math.abs(Math.floor(columnNumInput.value)) || 10;
    let rowNum = Math.abs(Math.floor(rowNumInput.value)) || 10;
    let bombNum = Math.abs(Math.floor(bombNumInput.value)) || Math.floor((columnNum * rowNumInput) / 10);
    console.log(columnNum, rowNum, bombNum);
    game.restart(columnNum, rowNum, bombNum, 50);
})


// FIXME
// 爆弾の数変更時に、爆弾の合計数の表示が更新されない

