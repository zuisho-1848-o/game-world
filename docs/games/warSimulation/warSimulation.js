/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./docs/games/warSimulation/Cell.ts":
/*!******************************************!*\
  !*** ./docs/games/warSimulation/Cell.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Cell: () => (/* binding */ Cell),\n/* harmony export */   CellType: () => (/* binding */ CellType),\n/* harmony export */   cellTypeToName: () => (/* binding */ cellTypeToName)\n/* harmony export */ });\nvar CellType;\n(function (CellType) {\n    CellType[\"Plain\"] = \"plain\";\n    CellType[\"City\"] = \"city\";\n    CellType[\"Capital\"] = \"capital\";\n    CellType[\"Factory\"] = \"factory\";\n})(CellType || (CellType = {}));\nclass Cell {\n    constructor(x, y, type, moveCost, defBuff, belong, supply, endurance, maxLevel, trainableUnits) {\n        this.x = x;\n        this.y = y;\n        this.type = type;\n        this.moveCost = moveCost;\n        this.defBuff = defBuff;\n        this.belong = belong;\n        this.supply = supply || {\n            army: 0,\n            navy: 0,\n            airForce: 0\n        };\n        this.endurance = endurance || 0;\n        this.occupationRate = 0;\n        this.level = 1;\n        this.maxLevel = maxLevel || 1;\n        this.trainableUnits = trainableUnits || [];\n    }\n    getTrainableUnits() {\n        return this.trainableUnits;\n    }\n    levelUp(num = 1) {\n        if (this.canLevelUp(num)) {\n            this.level += num;\n            return this.level;\n        }\n        return false;\n    }\n    canLevelUp(num = 1) {\n        if (this.type != CellType.City) {\n            return false;\n        }\n        if (this.level + num > this.maxLevel) {\n            return false;\n        }\n        return true;\n    }\n}\nconst cellTypeToName = (cellType) => {\n    switch (cellType) {\n        case CellType.Plain:\n            return \"草原\";\n        case CellType.Capital:\n            return \"首都\";\n        case CellType.City:\n            return \"街\";\n        case CellType.Factory:\n            return \"工場\";\n    }\n};\n\n\n//# sourceURL=webpack://online-card/./docs/games/warSimulation/Cell.ts?");

/***/ }),

/***/ "./docs/games/warSimulation/Game.ts":
/*!******************************************!*\
  !*** ./docs/games/warSimulation/Game.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Game: () => (/* binding */ Game)\n/* harmony export */ });\n/* harmony import */ var _Cell__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Cell */ \"./docs/games/warSimulation/Cell.ts\");\n/* harmony import */ var _Unit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Unit */ \"./docs/games/warSimulation/Unit.ts\");\n/* harmony import */ var _Player__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Player */ \"./docs/games/warSimulation/Player.ts\");\n\n\n\nconst defaultUnitData = [\n    {\n        type: _Unit__WEBPACK_IMPORTED_MODULE_1__.UnitType.FootSoldier,\n        maxHP: 10,\n        mobility: 5,\n        atk: 7,\n        occupyPower: 1,\n        range: 1,\n        cost: 250,\n        canAttackAfterMove: false,\n        actionNumPerTurn: 1,\n    }\n];\nconst defaultCellData = [\n    {\n        type: _Cell__WEBPACK_IMPORTED_MODULE_0__.CellType.Plain,\n        moveCost: 1,\n        defBuff: 0\n    },\n    {\n        type: _Cell__WEBPACK_IMPORTED_MODULE_0__.CellType.Capital,\n        moveCost: 1,\n        defBuff: 3,\n        supply: {\n            army: 3,\n            navy: 0,\n            airForce: 0\n        },\n        endurance: 3,\n        trainableUnits: [_Unit__WEBPACK_IMPORTED_MODULE_1__.UnitType.FootSoldier]\n    },\n];\nclass Game {\n    constructor(canvasID, cellSize, cellInfoDivID, institutionControlDivID, moneyDivID) {\n        this.field = [[]];\n        this.units = [];\n        this.players = [];\n        this.playerNum = 2;\n        this.AINum = 0;\n        this.humanNum = 2;\n        this.cellSize = cellSize;\n        this.rowNum = 10;\n        this.columnNum = 10;\n        this.width = this.cellSize * this.columnNum;\n        this.height = this.cellSize * this.rowNum;\n        this.canvas = document.querySelector(canvasID) || document.createElement(\"canvas\");\n        this.updateRowColumn(10, 10);\n        const ctx = this.canvas.getContext(\"2d\");\n        if (ctx) {\n            this.ctx = ctx;\n        }\n        else {\n            console.error(\"context を取得できませんでした。\");\n            // new Error(\"context を取得できませんでした。\");\n            this.ctx = null;\n        }\n        this.cellInfoDiv = document.querySelector(cellInfoDivID) || document.createElement(\"div\");\n        this.institutionControlDiv = document.querySelector(institutionControlDivID) || document.createElement(\"div\");\n        this.moneyDiv = document.querySelector(moneyDivID) || document.createElement(\"div\");\n        this.unitData = defaultUnitData;\n        this.cellData = defaultCellData;\n        this.turn = 1;\n        this.controlPlayer = 0;\n        this.playerColors = [\"blue\", \"red\"];\n        this.playerNames = [\"青軍\", \"赤軍\"];\n    }\n    init(map, humanNum, unitData, cellData) {\n        this.updateRowColumn(map.rowNum, map.columnNum);\n        this.field = this.initField(map.field);\n        this.units = [];\n        this.playerNum = map.playerNum;\n        this.humanNum = humanNum;\n        this.AINum = this.playerNum - this.humanNum;\n        this.players = [];\n        for (let i = 0; i < this.playerNum; i++) {\n            this.players.push(new _Player__WEBPACK_IMPORTED_MODULE_2__.Player(i, map.firstMoney[i], true, this.playerColors[i], this.playerNames[i]));\n        }\n        if (unitData) {\n            this.unitData = unitData;\n        }\n        if (cellData) {\n            this.cellData = cellData;\n        }\n        this.selectedCell = this.field[0][0];\n        this.handleCellSelect(this.selectedCell);\n        this.updateMoney();\n        this.canvas.addEventListener(\"click\", (e) => {\n            const { canvasX, canvasY } = this.clickEventToCanvasXY(e);\n            this.handleClick(canvasX, canvasY);\n        });\n        requestAnimationFrame(this.draw.bind(this));\n    }\n    initField(fieldMapData) {\n        const field = [];\n        for (let i = 0; i < this.rowNum; i++) {\n            const row = [];\n            for (let j = 0; j < this.columnNum; j++) {\n                const cellType = fieldMapData[j][i].cellType;\n                const cellStatus = this.cellData.find(cell => cell.type == cellType);\n                if (!cellStatus) {\n                    console.error(`initField に失敗しました。理由： cellType \"${cellType}\" は無効です。`);\n                }\n                else {\n                    row.push(new _Cell__WEBPACK_IMPORTED_MODULE_0__.Cell(j, i, cellType, cellStatus.moveCost, cellStatus.defBuff, fieldMapData[j][i].belong, cellStatus.supply, cellStatus.endurance, cellStatus.maxLevel, cellStatus.trainableUnits));\n                }\n            }\n            field.push(row);\n        }\n        return field;\n    }\n    save() {\n    }\n    load() { }\n    draw() {\n        this.ctx.fillStyle = \"black\";\n        this.ctx.fillRect(0, 0, this.width, this.height);\n        this.ctx.font = \"20px serif\";\n        this.ctx.textAlign = 'center';\n        for (let i = 0; i < this.rowNum; i++) {\n            for (let j = 0; j < this.columnNum; j++) {\n                this.drawCell(i, j);\n            }\n        }\n        for (let unit of this.units) {\n            this.drawUnit(unit);\n        }\n        this.drawActiveCell();\n        // if (this.gameState == \"clear\") {\n        //     this.ctx.font = \"100px serif\";\n        //     this.ctx.fillStyle = \"blue\";\n        //     const text = \"Clear\"\n        //     this.ctx.fillText(text, this.width / 2, this.height / 2);\n        // } else if (this.gameState == \"over\") {\n        //     this.ctx.font = \"80px serif\";\n        //     this.ctx.fillStyle = \"red\";\n        //     const text = \"Game Over\"\n        //     this.ctx.fillText(text, this.width / 2, this.height / 2);\n        // }\n        requestAnimationFrame(this.draw.bind(this));\n    }\n    drawCell(i, j) {\n        var _a;\n        const cell = this.field[i][j];\n        const cellCanvasLeft = j * this.cellSize;\n        const cellCanvasTop = i * this.cellSize;\n        if (cell.type == _Cell__WEBPACK_IMPORTED_MODULE_0__.CellType.Plain) {\n            this.ctx.fillStyle = ((_a = this.cellData.find(cell => cell.type == _Cell__WEBPACK_IMPORTED_MODULE_0__.CellType.Plain)) === null || _a === void 0 ? void 0 : _a.color) || \"green\";\n            this.ctx.fillRect(cellCanvasLeft, cellCanvasTop, this.cellSize, this.cellSize);\n        }\n        else if (cell.type == _Cell__WEBPACK_IMPORTED_MODULE_0__.CellType.Capital) {\n            this.ctx.fillStyle = \"white\";\n            this.ctx.fillRect(cellCanvasLeft, cellCanvasTop, this.cellSize, this.cellSize);\n            this.ctx.fillStyle = \"gray\";\n            // console.log(cell.belong);\n            if (cell.belong >= 0) {\n                const color = this.playerColors[cell.belong];\n                if (color) {\n                    this.ctx.fillStyle = color;\n                }\n            }\n            const text = \"首\";\n            this.ctx.fillText(text, cellCanvasLeft + this.cellSize / 2, cellCanvasTop + this.cellSize / 2);\n        }\n        else {\n            console.error(`cannot draw invalid CellType \"${cell.type}\"`);\n            // this.ctx.drawImage(this.images.flag, cellCanvasLeft, cellCanvasTop, this.cellSize, this.cellSize);\n        }\n    }\n    drawUnit(unit) {\n        const cellCanvasLeft = unit.x * this.cellSize;\n        const cellCanvasTop = unit.y * this.cellSize;\n        if (unit.type == _Unit__WEBPACK_IMPORTED_MODULE_1__.UnitType.FootSoldier) {\n            this.ctx.fillStyle = this.playerColors[unit.belong];\n            const text = \"歩\";\n            this.ctx.fillText(text, cellCanvasLeft + this.cellSize / 2, cellCanvasTop + this.cellSize / 2);\n        }\n        else {\n            console.error(`cannot draw invalid UnitType \"${unit.type}\"`);\n        }\n    }\n    drawActiveCell() {\n        this.ctx.strokeStyle = \"yellow\";\n        if (this.selectedCell) {\n            this.ctx.strokeRect(this.selectedCell.x * this.cellSize, this.selectedCell.y * this.cellSize, this.cellSize, this.cellSize);\n        }\n    }\n    updateRowColumn(rowNum, columnNum) {\n        this.rowNum = rowNum;\n        this.columnNum = columnNum;\n        this.width = this.cellSize * this.columnNum;\n        this.height = this.cellSize * this.rowNum;\n        // console.log(this.canvas);\n        this.canvas.width = this.width;\n        this.canvas.height = this.height;\n        this.canvas.style.width = this.width + \"px\";\n        this.canvas.style.height = this.height + \"px\";\n    }\n    handleClick(posX, posY) {\n        const x = Math.floor(posX / this.cellSize);\n        const y = Math.floor(posY / this.cellSize);\n        // console.log(x, y);\n        this.selectedCell = this.field[y][x];\n        const selectedUnit = this.units.find(unit => unit.x == x && unit.y == y);\n        if (selectedUnit)\n            this.handleUnitSelect(selectedUnit);\n        this.handleCellSelect(this.selectedCell);\n    }\n    handleUnitSelect(unit) {\n    }\n    handleCellSelect(selectedCell) {\n        this.updateCellInfo(selectedCell);\n        this.updateInstitutionControl(selectedCell);\n    }\n    updateCellInfo(selectedCell) {\n        this.cellInfoDiv.innerHTML = `<h2>地点情報</h2>\n        <h3>${(0,_Cell__WEBPACK_IMPORTED_MODULE_0__.cellTypeToName)(selectedCell.type)}</h3>`;\n    }\n    updateInstitutionControl(selectedCell) {\n        var _a;\n        const trainableUnits = selectedCell.getTrainableUnits();\n        if (trainableUnits.length > 0 && selectedCell.belong == this.controlPlayer) {\n            const unitLis = [];\n            for (let unitType of trainableUnits) {\n                const unitCost = (_a = this.unitData.find(unitStatus => unitStatus.type == unitType)) === null || _a === void 0 ? void 0 : _a.cost;\n                unitLis.push(`<li>\n                    <div class=\"unitName\">${(0,_Unit__WEBPACK_IMPORTED_MODULE_1__.unitTypeToName)(unitType)}</div>\n                    <div class=\"unitCost\">${unitCost}円</div>\n                </li>`);\n            }\n            this.institutionControlDiv.innerHTML = `<ul class=\"unitTrain\">${unitLis.join(\"\\n\")}</ul>`;\n        }\n        else if (selectedCell.canLevelUp(1)) {\n            // ここでレベルアップメニューを表示\n            this.institutionControlDiv.innerHTML = ``;\n        }\n        else {\n            this.institutionControlDiv.innerHTML = ``;\n        }\n    }\n    finishTurn() {\n    }\n    startTurn() {\n    }\n    updateMoney() {\n        this.moneyDiv.innerHTML = ``;\n        for (let player of this.players) {\n            this.moneyDiv.innerHTML += `<span style=\"color: ${player.color}\">${player.name}: ${player.money}円</span>`;\n        }\n    }\n    clickEventToCanvasXY(e) {\n        var _a;\n        const rect = (_a = e.target) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect();\n        // ブラウザ上での座標を求める\n        const viewX = e.clientX - rect.left;\n        const viewY = e.clientY - rect.top;\n        // 表示サイズとキャンバスの実サイズの比率を求める\n        const scaleWidth = this.canvas.clientWidth / this.canvas.width;\n        const scaleHeight = this.canvas.clientHeight / this.canvas.height;\n        // ブラウザ上でのクリック座標をキャンバス上に変換\n        const canvasX = Math.floor(viewX / scaleWidth);\n        const canvasY = Math.floor(viewY / scaleHeight);\n        return { canvasX, canvasY };\n    }\n}\n\n\n//# sourceURL=webpack://online-card/./docs/games/warSimulation/Game.ts?");

/***/ }),

/***/ "./docs/games/warSimulation/Player.ts":
/*!********************************************!*\
  !*** ./docs/games/warSimulation/Player.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Player: () => (/* binding */ Player)\n/* harmony export */ });\nclass Player {\n    constructor(id, money, isAlive, color, name) {\n        this.id = id;\n        this.money = money;\n        this.isAlive = isAlive;\n        this.color = color;\n        this.name = name;\n    }\n}\n\n\n//# sourceURL=webpack://online-card/./docs/games/warSimulation/Player.ts?");

/***/ }),

/***/ "./docs/games/warSimulation/Unit.ts":
/*!******************************************!*\
  !*** ./docs/games/warSimulation/Unit.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Unit: () => (/* binding */ Unit),\n/* harmony export */   UnitType: () => (/* binding */ UnitType),\n/* harmony export */   unitTypeToName: () => (/* binding */ unitTypeToName)\n/* harmony export */ });\nvar UnitType;\n(function (UnitType) {\n    UnitType[\"FootSoldier\"] = \"footSoldier\";\n})(UnitType || (UnitType = {}));\nclass Unit {\n    constructor(x, y, maxHP, type, mobility, atk, occupyPower, range, belong, cost, canAttackAfterMove, actionNumPerTurn) {\n        this.x = x;\n        this.y = y;\n        this.xTemp = -1;\n        this.yTemp = -1;\n        this.maxHP = maxHP;\n        this.hp = maxHP;\n        this.type = type;\n        this.mobility = mobility;\n        this.atk = atk;\n        this.occupyPower = occupyPower;\n        this.range = range;\n        this.belong = belong;\n        this.cost = cost;\n        this.canAttackAfterMove = canAttackAfterMove;\n        this.actionNumPerTurn = actionNumPerTurn;\n        this.thisTurnMovedNum = 0;\n        this.isProducing = true;\n    }\n    move(x, y) {\n        this.x = x;\n        this.y = y;\n        this.thisTurnMovedNum += 1;\n    }\n    tempMove(x, y) {\n        this.xTemp = x;\n        this.yTemp = y;\n    }\n    damage(point) {\n        this.hp -= point;\n        if (this.hp <= 0) {\n            return true;\n        }\n        return false;\n    }\n    stay() {\n        this.thisTurnMovedNum = this.actionNumPerTurn;\n    }\n    heal(point) {\n        this.hp = Math.min(this.maxHP, this.hp + point);\n    }\n}\nconst unitTypeToName = (unitType) => {\n    switch (unitType) {\n        case UnitType.FootSoldier:\n            return \"歩兵\";\n    }\n};\n\n\n//# sourceURL=webpack://online-card/./docs/games/warSimulation/Unit.ts?");

/***/ }),

/***/ "./docs/games/warSimulation/index.ts":
/*!*******************************************!*\
  !*** ./docs/games/warSimulation/index.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Cell__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Cell */ \"./docs/games/warSimulation/Cell.ts\");\n/* harmony import */ var _Game__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Game */ \"./docs/games/warSimulation/Game.ts\");\n\n\nconsole.log(\"loaded\");\nconst cellSize = 50;\nconst game = new _Game__WEBPACK_IMPORTED_MODULE_1__.Game(\"#gameCanvas\", cellSize, \"#cellInfo\", \"#institutionControl\", \"#money\");\nconst defaultMapField = [];\nfor (let i = 0; i < 10; i++) {\n    const row = [];\n    for (let j = 0; j < 10; j++) {\n        row.push({ cellType: _Cell__WEBPACK_IMPORTED_MODULE_0__.CellType.Plain, belong: -1 });\n    }\n    defaultMapField.push(row);\n}\ndefaultMapField[0][0] = { cellType: _Cell__WEBPACK_IMPORTED_MODULE_0__.CellType.Capital, belong: 0 };\ndefaultMapField[9][9] = { cellType: _Cell__WEBPACK_IMPORTED_MODULE_0__.CellType.Capital, belong: 1 };\nconsole.log(defaultMapField);\nconst defaultMap = {\n    version: 1,\n    columnNum: 10,\n    rowNum: 10,\n    playerNum: 2,\n    field: defaultMapField,\n    units: [],\n    firstMoney: [500, 500],\n};\ngame.init(defaultMap, 2);\n\n\n//# sourceURL=webpack://online-card/./docs/games/warSimulation/index.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./docs/games/warSimulation/index.ts");
/******/ 	
/******/ })()
;