import { CellType } from "./Cell";
import { Game, GameMap } from "./Game";
console.log("loaded");


const cellSize = 50;
const game = new Game("#gameCanvas", cellSize);


const defaultMapField = [];
for(let i = 0; i < 10; i++) {
    const row = [];
    for(let j = 0; j < 10; j++) {
        row.push({cellType: CellType.Plain, belong: -1});
    }
    defaultMapField.push(row);

}

console.log(defaultMapField);

const defaultMap: GameMap = {
    version: 1,
    columnNum: 10,
    rowNum: 10,
    playerNum: 2,
    field: defaultMapField,
    units: [],
}



game.init(defaultMap, 2);