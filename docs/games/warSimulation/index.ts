import { CellType} from "./Cell";
import { Game, GameMap } from "./Game";
console.log("loaded");


const cellSize = 50;
const game = new Game("#gameCanvas", cellSize, "#cellInfo", "#institutionControl", "#money", "#turn");


const defaultMapField: {cellType: CellType, belong: number}[][] = [];
for(let i = 0; i < 10; i++) {
    const row = [];
    for(let j = 0; j < 10; j++) {
        row.push({cellType: CellType.Plain, belong: -1});
    }
    defaultMapField.push(row);

}

defaultMapField[0][0] = {cellType: CellType.Capital, belong: 0};
defaultMapField[9][9] = {cellType: CellType.Capital, belong: 1};

console.log(defaultMapField);

const defaultMap: GameMap = {
    version: 1,
    columnNum: 10,
    rowNum: 10,
    playerNum: 2,
    field: defaultMapField,
    units: [],
    firstMoney: [500, 500],
}



game.init(defaultMap, 2);

document.addEventListener("click", (e) => {
    // console.log(e.target);
    if(e.target?.classList.contains("trainUnitLi")) {
        const type = e.target.dataset.type;
        game.tryTraining(type);
    }
})