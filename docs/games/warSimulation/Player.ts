export class Player {
    id: number
    money: number
    isAlive: boolean
    color: string

    constructor(id: number, money: number, isAlive: boolean, color: string) {
        this.id = id;
        this.money = money;
        this.isAlive = isAlive;
        this.color = color;
    }
}