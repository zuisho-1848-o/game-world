# 戦争シミュレーションゲーム



# 構造

## Game クラス

### プロパティ
* field: Cell[ ][ ]
* Units: Unit[ ]
* turn: number
* controlPlayer: IDにするかPlayerにするか
* Players: Player[ ]
* rowNum
* columnNum
* cellSize
* width
* height
* playerNum
* AINum
* canvas
* ctx
* unitData
* selectedCell
* selectedUnit
* movableCells
* attackableCells




### メソッド
* init(map: Map)
* handleClick(posX, posY)
* tempMove(Unit, x, y)
* moveFix(Unit, x, y)
* calcMovableCell(Unit)
* attack(attackUnit, defenseUnit)
* calcAttackableCellAftetTempMove(Unit)
* save()
* finishTurn()
* startTurn(playerID) 占領とターン収入と補給
* draw()
  * drawCell()
  * drawUnit()
  





## Cell クラス

### プロパティ
* x: number
* y: number
* moveCost: number
* defBuff: number（%）
* (isSelected)
* type: CellType == "grass" |"city"|"capital"| | "factory" | "mountain" |"river"|"sea"
* （unit?: Unit | null）

ユニットはセルに付属させずxyで管理するほうが良さそう

### メソッド


### サブクラス
* Insutitution (belong, 補給力, 占領率, 耐久力)
    * City （レベルアップ可能なところ）
    * Metropolis (2つのCityが合体しているところ)
  * Base（生産可能なところ）
    * Capital
    * Factory
    * Airport
    * Port
*


## City クラス

### プロパティ
* level
* 

### メソッド
* levelUp



## Unit クラス

### プロパティ
* x: number
* y: number
* xTemp
* yTemp
* maxHP: number
* hp : number
* type: UnitType
* movility: number
* atk: number
* 占領力: number
* 射程距離: number
* belong
* cost: number
* canAttackAftetMove
* actionNumPerTurn
* thisTurnMovedNum
* (isSelected)

UnitType でほとんどのプロパティが決まる
→Type ごとにサブクラスにするのも微妙、
　Typeごとの値をGameクラスで管理するかな
→変動があり得るので、
　プロパティとしては残すし計算もここを使うが、
　インスタンス生成時にGameクラスから設定

### メソッド
* move(x,y)
* tempMove(x, y)
* damage(point)
* heal(point)

管理は全てGameクラス。
これらのメソッドは、値を変えるだけ。



## Player クラス

### プロパティ
* id: number (index をそのままいれる)
* money: number
* isAlive: boolean
* color: string


### メソッド


### サブクラス