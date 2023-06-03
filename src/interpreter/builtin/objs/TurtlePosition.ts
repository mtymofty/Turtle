import { Position } from "../../../source/Position";
import { ObjectInstance } from "./ObjectInstance";

export class TurtlePosition implements ObjectInstance {
    x: number
    y: number

    attr = {
        ["x"]: {getter: this.getX.bind(this),
                setter: this.setX.bind(this),
                type: "integer"},
        ["y"]: {getter: this.getY.bind(this),
                setter: this.setY.bind(this),
                type: "integer"},
    }

    methods = {}

    constructor(x?: number, y?: number) {
        this.x = (x) ? x : 0;
        this.y = (y) ? y : 0;
    }

    validateAttr(_: Position): void {
    }

    getX(){
        return this.x
    }

    getY(){
        return this.y
    }

    setX(x: number){
        this.x = x
    }

    setY(y: number){
        this.y = y
    }
}
