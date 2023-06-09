export enum UnitType {
    FootSoldier = "footSoldier"
}

export interface UnitStatus {
    maxHP: number
    type: UnitType
    mobility: number
    atk: number
    occupyPower: number;
    range: number
    cost: number
    canAttackAfterMove: boolean
    actionNumPerTurn: number
}

export class Unit {
    x: number
    y: number
    xTemp: number
    yTemp: number
    maxHP: number
    hp: number
    type: UnitType
    mobility: number
    atk: number
    occupyPower: number;
    range: number
    belong: number
    cost: number
    canAttackAfterMove: boolean
    actionNumPerTurn: number
    thisTurnMovedNum: number
    isProducing: boolean

    constructor(x: number, y: number, maxHP: number, type: UnitType, mobility: number, atk: number, occupyPower: number, range: number, belong: number, cost: number, canAttackAfterMove: boolean, actionNumPerTurn: number) {
        this.x = x;
        this.y = y;
        this.xTemp = x;
        this.yTemp = y;

        this.maxHP = maxHP;
        this.hp = maxHP;

        this.type = type;
        this.mobility = mobility;
        this.atk = atk;
        this.occupyPower = occupyPower;
        this.range = range;
        this.belong = belong;
        this.cost = cost;
        this.canAttackAfterMove = canAttackAfterMove;
        this.actionNumPerTurn = actionNumPerTurn;

        this.thisTurnMovedNum = 0;

        this.isProducing = true;
    }

    move(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.xTemp = x;
        this.yTemp = y;
        this.thisTurnMovedNum += 1;
    }

    moveFix() {
        this.x = this.xTemp;
        this.y = this.yTemp;
        this.thisTurnMovedNum += 1;
    }

    tempMove(x: number, y: number) {
        this.xTemp = x;
        this.yTemp = y;
    }

    cancelTempMove() {
        this.xTemp = this.x;
        this.yTemp = this.y;
    }

    damage(point: number) {
        this.hp -= point;
        if(this.hp <= 0) {
            return true;
        }
        return false;
    }

    stay() {
        this.thisTurnMovedNum = this.actionNumPerTurn;
    }

    heal(point: number) {
        this.hp = Math.min(this.maxHP, this.hp + point);
    }
}

export const unitTypeToName = (unitType: UnitType) => {
    switch(unitType) {
        case UnitType.FootSoldier:
            return "歩兵";
    }
}

