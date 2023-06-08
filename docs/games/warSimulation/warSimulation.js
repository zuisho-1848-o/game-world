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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Cell: () => (/* binding */ Cell),\n/* harmony export */   CellType: () => (/* binding */ CellType)\n/* harmony export */ });\nvar CellType;\n(function (CellType) {\n    CellType[\"Plain\"] = \"plain\";\n    CellType[\"City\"] = \"city\";\n    CellType[\"Capital\"] = \"capital\";\n    CellType[\"Factory\"] = \"factory\";\n})(CellType || (CellType = {}));\nclass Cell {\n    constructor(x, y, type, moveCost, defBuff) {\n        this.x = x;\n        this.y = y;\n        this.type = type;\n        this.moveCost = moveCost;\n        this.defBuff = defBuff;\n    }\n}\n\n\n//# sourceURL=webpack://online-card/./docs/games/warSimulation/Cell.ts?");

/***/ }),

/***/ "./docs/games/warSimulation/Game.ts":
/*!******************************************!*\
  !*** ./docs/games/warSimulation/Game.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Game: () => (/* binding */ Game)\n/* harmony export */ });\n/* harmony import */ var _Cell__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Cell */ \"./docs/games/warSimulation/Cell.ts\");\n\nconst defaultUnitData = [];\nconst defaultCellData = [\n    {\n        type: _Cell__WEBPACK_IMPORTED_MODULE_0__.CellType.Plain,\n        moveCost: 1,\n        defBuff: 0\n    }\n];\nclass Game {\n    constructor(canvasID, cellSize) {\n        this.field = [[]];\n        this.units = [];\n        this.players = [];\n        this.playerNum = 2;\n        this.AINum = 0;\n        this.humanNum = 2;\n        this.cellSize = cellSize;\n        this.rowNum = 10;\n        this.columnNum = 10;\n        this.width = this.cellSize * this.columnNum;\n        this.height = this.cellSize * this.rowNum;\n        this.canvas = document.querySelector(canvasID) || document.createElement(\"canvas\");\n        this.updateRowColumn(10, 10);\n        const ctx = this.canvas.getContext(\"2d\");\n        if (ctx) {\n            this.ctx = ctx;\n        }\n        else {\n            console.error(\"context を取得できませんでした。\");\n            // new Error(\"context を取得できませんでした。\");\n            this.ctx = null;\n        }\n        this.unitData = defaultUnitData;\n        this.cellData = defaultCellData;\n        this.turn = 1;\n        this.controlPlayer = 0;\n    }\n    init(map, humanNum, unitData, cellData) {\n        this.updateRowColumn(map.rowNum, map.columnNum);\n        this.field = this.initField(map.field);\n        this.units = [];\n        this.playerNum = map.playerNum;\n        this.humanNum = humanNum;\n        this.AINum = this.playerNum - this.humanNum;\n        if (unitData) {\n            this.unitData = unitData;\n        }\n        if (cellData) {\n            this.cellData = cellData;\n        }\n        requestAnimationFrame(this.draw.bind(this));\n    }\n    initField(fieldMapData) {\n        const field = [];\n        for (let i = 0; i < this.rowNum; i++) {\n            const row = [];\n            for (let j = 0; j < this.columnNum; j++) {\n                const cellType = fieldMapData[j][i].cellType;\n                const cellStatus = this.cellData.find(cell => cell.type == cellType);\n                if (!cellStatus) {\n                    console.error(`initField に失敗しました。理由： cellType \"${cellType}\" は無効です。`);\n                }\n                else {\n                    row.push(new _Cell__WEBPACK_IMPORTED_MODULE_0__.Cell(j, i, cellType, cellStatus.moveCost, cellStatus.defBuff));\n                }\n            }\n            field.push(row);\n        }\n        return field;\n    }\n    save() {\n    }\n    load() { }\n    draw() {\n        this.ctx.fillStyle = \"black\";\n        this.ctx.fillRect(0, 0, this.width, this.height);\n        this.ctx.font = \"20px serif\";\n        this.ctx.textAlign = 'center';\n        for (let i = 0; i < this.rowNum; i++) {\n            for (let j = 0; j < this.columnNum; j++) {\n                this.drawCell(i, j);\n            }\n        }\n        // if (this.gameState == \"clear\") {\n        //     this.ctx.font = \"100px serif\";\n        //     this.ctx.fillStyle = \"blue\";\n        //     const text = \"Clear\"\n        //     this.ctx.fillText(text, this.width / 2, this.height / 2);\n        // } else if (this.gameState == \"over\") {\n        //     this.ctx.font = \"80px serif\";\n        //     this.ctx.fillStyle = \"red\";\n        //     const text = \"Game Over\"\n        //     this.ctx.fillText(text, this.width / 2, this.height / 2);\n        // }\n        requestAnimationFrame(this.draw.bind(this));\n    }\n    drawCell(i, j) {\n        var _a;\n        const cell = this.field[i][j];\n        const cellCanvasLeft = j * this.cellSize;\n        const cellCanvasTop = i * this.cellSize;\n        if (cell.type == \"plain\") {\n            this.ctx.fillStyle = ((_a = this.cellData.find(cell => cell.type == _Cell__WEBPACK_IMPORTED_MODULE_0__.CellType.Plain)) === null || _a === void 0 ? void 0 : _a.color) || \"green\";\n            this.ctx.fillRect(cellCanvasLeft, cellCanvasTop, this.cellSize, this.cellSize);\n        }\n        else {\n            // this.ctx.drawImage(this.images.flag, cellCanvasLeft, cellCanvasTop, this.cellSize, this.cellSize);\n        }\n    }\n    updateRowColumn(rowNum, columnNum) {\n        this.rowNum = rowNum;\n        this.columnNum = columnNum;\n        this.width = this.cellSize * this.columnNum;\n        this.height = this.cellSize * this.rowNum;\n        // console.log(this.canvas);\n        this.canvas.width = this.width;\n        this.canvas.height = this.height;\n        this.canvas.style.width = this.width + \"px\";\n        this.canvas.style.height = this.height + \"px\";\n    }\n}\n\n\n//# sourceURL=webpack://online-card/./docs/games/warSimulation/Game.ts?");

/***/ }),

/***/ "./docs/games/warSimulation/index.ts":
/*!*******************************************!*\
  !*** ./docs/games/warSimulation/index.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Cell__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Cell */ \"./docs/games/warSimulation/Cell.ts\");\n/* harmony import */ var _Game__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Game */ \"./docs/games/warSimulation/Game.ts\");\n\n\nconsole.log(\"loaded\");\nconst cellSize = 50;\nconst game = new _Game__WEBPACK_IMPORTED_MODULE_1__.Game(\"#gameCanvas\", cellSize);\nconst defaultMapField = [];\nfor (let i = 0; i < 10; i++) {\n    const row = [];\n    for (let j = 0; j < 10; j++) {\n        row.push({ cellType: _Cell__WEBPACK_IMPORTED_MODULE_0__.CellType.Plain, belong: -1 });\n    }\n    defaultMapField.push(row);\n}\nconsole.log(defaultMapField);\nconst defaultMap = {\n    version: 1,\n    columnNum: 10,\n    rowNum: 10,\n    playerNum: 2,\n    field: defaultMapField,\n    units: [],\n};\ngame.init(defaultMap, 2);\n\n\n//# sourceURL=webpack://online-card/./docs/games/warSimulation/index.ts?");

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