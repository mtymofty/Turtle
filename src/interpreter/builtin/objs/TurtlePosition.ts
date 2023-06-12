import { ErrorHandler } from "../../../error/ErrorHandler";
import { WarningType } from "../../../error/ErrorType";
import { Position } from "../../../source/Position";
import { ObjectInstance } from "./ObjectInstance";

export class TurtlePosition implements ObjectInstance {
    x: number
    y: number

    min_x: number = 0
    max_x: number = 500
    min_y: number = 0
    max_y: number = 500

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

    validateAttr(pos: Position): void {
        if (this.x < this.min_x) {
            ErrorHandler.print_warning_mess(WarningType.POS_WARN, ["X", this.min_x.toString()], pos)
            this.x = this.min_x
        } else if (this.x > this.max_x) {
            ErrorHandler.print_warning_mess(WarningType.POS_WARN, ["X", this.max_x.toString()], pos)
            this.x = this.max_x
        }
        if (this.y < this.min_y) {
            ErrorHandler.print_warning_mess(WarningType.POS_WARN, ["Y", this.min_y.toString()], pos)
            this.y = this.min_y
        } else if (this.y > this.max_y) {
            ErrorHandler.print_warning_mess(WarningType.POS_WARN, ["Y", this.max_y.toString()], pos)
            this.y = this.max_y
        }
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
