import { Position } from "../../source/Position";
import { ObjectInstance } from "./ObjectInstance";

export class TurtlePosition implements ObjectInstance {
    x: number
    y: number

    attr = {
        ["x"]: this.getX.bind(this),
        ["y"]: this.getY.bind(this)
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
}
