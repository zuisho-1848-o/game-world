class Game {
    constructor(canvasId, n) {
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext("2d");
        this.n = n; // n x n grid
        this.cellSize = 100; // Size of each cell in pixels
        this.canvas.width = this.cellSize * n;
        this.canvas.height = this.cellSize * n;
        this.board = new Board(n);
        this.players = [
            new Player("red", "赤", "red"),
            new Player("blue", "青", "blue")
        ];
        this.gameState = "playing";
        this.currentPlayerIndex = 0;
        this.hoveredCell = null;
        this.initHTML();
        this.initEvents();
        this.draw();
    }

    initHTML() {
        this.statusIndicator = document.querySelector("#statusIndicator");
        this.resetButton = document.querySelector("#resetButton");
        this.resetButton.addEventListener("click", () => this.resetGame());
        this.updateStatus();
    }

    updateStatus(message = null) {
        if (message) {
            this.statusIndicator.innerHTML = `<span style="color: ${this.players[this.currentPlayerIndex].color};">${message}</span>`;
        } else {
            const currentPlayer = this.players[this.currentPlayerIndex];
            this.statusIndicator.innerHTML = `現在の手番: <span style="color: ${currentPlayer.color};">${currentPlayer.japaneseName} (${currentPlayer.englishName.toUpperCase()})</span>`;
        }
    }

    initEvents() {
        this.canvas.addEventListener("click", (event) => {
            if (this.gameState !== "playing") return;

            const rect = this.canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const row = Math.floor(y / this.cellSize);
            const col = Math.floor(x / this.cellSize);
            const cell = this.board.getCell(row, col);

            if (cell) {
                const piece = cell.getPieceAt(x % this.cellSize, y % this.cellSize, this.cellSize);

                if (!piece) {
                    if (cell.addPieceAtPosition(this.players[this.currentPlayerIndex].color, x % this.cellSize, y % this.cellSize, this.cellSize)) {
                        if (this.board.checkWin(this.players[this.currentPlayerIndex].color)) {
                            this.updateStatus(`${this.players[this.currentPlayerIndex].japaneseName} の勝利！`);
                            this.gameState = "finished";
                        } else {
                            this.currentPlayerIndex = 1 - this.currentPlayerIndex;
                            this.updateStatus();
                        }
                        this.draw();
                    }
                }
            }
        });

        this.canvas.addEventListener("mousemove", (event) => {
            if (this.gameState !== "playing") {
                this.hoveredCell = null;
                this.canvas.style.cursor = "not-allowed";
                return;
            }

            const rect = this.canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const row = Math.floor(y / this.cellSize);
            const col = Math.floor(x / this.cellSize);
            const cell = this.board.getCell(row, col);

            if (cell) {
                const piece = cell.getPieceAt(x % this.cellSize, y % this.cellSize, this.cellSize);
                if (!piece) {
                    this.canvas.style.cursor = "pointer";
                } else {
                    this.canvas.style.cursor = "not-allowed";
                }
                this.hoveredCell = { row, col, x: x % this.cellSize, y: y % this.cellSize };
                this.draw();
            }
        });

        this.canvas.addEventListener("mouseleave", () => {
            this.hoveredCell = null;
            this.canvas.style.cursor = "default";
            this.draw();
        });
    }

    draw() {
        this.context.fillStyle = "#f0f0f0"; // Background color
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.board.draw(this.context, this.cellSize, this.hoveredCell);
    }

    resetGame() {
        this.board = new Board(this.n);
        this.currentPlayerIndex = 0;
        this.gameState = "playing";
        this.updateStatus();
        this.draw();
    }
}

class Player {
    constructor(englishName, japaneseName, color) {
        this.englishName = englishName;
        this.japaneseName = japaneseName;
        this.color = color;
    }
}

class Board {
    constructor(n) {
        this.n = n;
        this.cells = Array.from({ length: n }, () =>
            Array.from({ length: n }, () => new Cell(n))
        );
    }

    getCell(row, col) {
        if (row < 0 || col < 0 || row >= this.n || col >= this.n) return null;
        return this.cells[row][col];
    }

    // addPiece(row, col, color) {
    //     if (row < 0 || col < 0 || row >= this.n || col >= this.n) return false;
    //     return this.cells[row][col].addPiece(color);
    // }

    draw(context, cellSize, hoveredCell) {
        context.strokeStyle = "black";
        for (let row = 0; row < this.n; row++) {
            for (let col = 0; col < this.n; col++) {
                const x = col * cellSize;
                const y = row * cellSize;
                context.strokeStyle = "black";
                context.strokeRect(x, y, cellSize, cellSize);
                this.cells[row][col].draw(context, x, y, cellSize, hoveredCell);
            }
        }
    }

    checkWin(color) {
        // Check for win in rows, columns, diagonals, or within a cell
        return (
            this.checkRows(color) ||
            this.checkCols(color) ||
            this.checkDiagonals(color) ||
            this.checkCellOwnership(color)
        );
    }

    checkRows(color) {
        for (let row = 0; row < this.n; row++) {
            for (let pieceIndex = 0; pieceIndex < this.cells[row][0].pieceNum; pieceIndex++) {
                if (this.cells[row].every(cell => cell.isPositionOwned(pieceIndex, color))) {
                    return true;
                }
            }
        }
        return false;
    }

    checkCols(color) {
        for (let col = 0; col < this.n; col++) {
            for (let pieceIndex = 0; pieceIndex < this.cells[0][col].pieceNum; pieceIndex++) {
                if (this.cells.every(row => row[col].isPositionOwned(pieceIndex, color))) {
                    return true;
                }
            }
        }
        return false;
    }

    checkDiagonals(color) {
        for (let pieceIndex = 0; pieceIndex < this.cells[0][0].pieceNum; pieceIndex++) {
            const mainDiagonal = this.cells.every((row, i) =>
                row[i].isPositionOwned(pieceIndex, color)
            );
            const antiDiagonal = this.cells.every((row, i) =>
                row[this.n - 1 - i].isPositionOwned(pieceIndex, color)
            );
            if (mainDiagonal || antiDiagonal) {
                return true;
            }
        }
        return false;
    }

    checkCellOwnership(color) {
        return this.cells.some(row => row.some(cell => cell.isFullyOwned(color)));
    }
}

class Cell {
    constructor(pieceNum) {
        this.pieceNum = pieceNum;
        this.pieces = Array.from({ length: pieceNum * pieceNum }, () => null);
    }

    // addPiece(color) {
    //     if (this.pieces.length >= this.maxPieces) return false;
    //     this.pieces.push({ color });
    //     return true;
    // }

    addPieceAtPosition(color, x, y, cellSize) {
        const pieceSize = cellSize / Math.sqrt(this.pieceNum);
        const col = Math.floor(x / pieceSize);
        const row = Math.floor(y / pieceSize);
        const index = row * Math.sqrt(this.pieceNum) + col;

        if (this.pieces[index]) return false; // Position already occupied

        this.pieces[index] = { color };
        return true;
    }

    getPieceAt(x, y, cellSize) {
        const pieceSize = cellSize / Math.sqrt(this.pieceNum);
        const col = Math.floor(x / pieceSize);
        const row = Math.floor(y / pieceSize);
        const index = row * Math.sqrt(this.pieceNum) + col;
        return this.pieces[index] || null;
    }

    draw(context, x, y, size, hoveredCell) {
        const pieceSize = size / Math.sqrt(this.pieceNum);
        context.strokeStyle = "rgba(0, 0, 0, 0.3)"; // Thin grid lines for pieces
        context.setLineDash([2, 2]);
        for (let i = 1; i < Math.sqrt(this.pieceNum); i++) {
            const offset = i * pieceSize;
            context.beginPath();
            context.moveTo(x + offset, y);
            context.lineTo(x + offset, y + size);
            context.moveTo(x, y + offset);
            context.lineTo(x + size, y + offset);
            context.stroke();
        }
        context.setLineDash([]);

        this.pieces.forEach((piece, index) => {
            if (piece) {
                const px = x + (index % Math.sqrt(this.pieceNum)) * pieceSize + 0.25;
                const py = y + Math.floor(index / Math.sqrt(this.pieceNum)) * pieceSize + 0.25;
                context.fillStyle = piece.color;
                context.fillRect(px, py, pieceSize - 0.5, pieceSize - 0.5);
            }
        });

        if (hoveredCell && hoveredCell.row === Math.floor(y / size) && hoveredCell.col === Math.floor(x / size)) {
            const hx = x + (Math.floor(hoveredCell.x / pieceSize) * pieceSize);
            const hy = y + (Math.floor(hoveredCell.y / pieceSize) * pieceSize);
            context.fillStyle = "yellow";
            context.globalAlpha = 0.3;
            context.fillRect(hx, hy, pieceSize, pieceSize);
            context.globalAlpha = 1;
        }

        // if (hoveredCell && hoveredCell.row === Math.floor(y / size) && hoveredCell.col === Math.floor(x / size)) {
        //     // const hx = x + (Math.floor(hoveredCell.x / pieceSize) * pieceSize);
        //     // const hy = y + (Math.floor(hoveredCell.y / pieceSize) * pieceSize);
        //     // context.strokeStyle = "yellow";
        //     // context.lineWidth = 2;
        //     // context.strokeRect(hx, hy, pieceSize, pieceSize);
        //     // context.lineWidth = 1;
        // }
    }

    isFullyOwned(color) {
        return this.pieces.length === this.pieceNum &&
            this.pieces.every((piece) => piece && piece.color === color);
    }

    isPositionOwned(index, color) {
        return this.pieces[index] && this.pieces[index].color === color;
    }
}

// class Piece {
//     constructor(x, y, size) {
//         this.color = null;
//         this.x = x;
//         this.y = y;
//         this.size = size;
//     }
// }

// Initialize the game
const game = new Game("gameCanvas", 4);
