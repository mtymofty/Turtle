import { ErrorHandler } from "../../error/ErrorHandler";
import { WarningType } from "../../error/ErrorType";
import { Position } from "../../source/Position";
import { ObjectInstance } from "./ObjectInstance";

export class Color implements ObjectInstance {
    a: number //0-100
    r: number //0-255
    g: number //0-255
    b: number //0-255

    min_a: number = 0
    max_a: number = 100
    min_rgb: number = 0
    max_rgb: number = 255

    attr = {
        ["a"]: this.getA.bind(this),
        ["r"]: this.getR.bind(this),
        ["g"]: this.getG.bind(this),
        ["b"]: this.getB.bind(this)
    }

    methods = {}

    constructor(a?: number, r?: number, g?: number, b?: number) {
        this.a = (a) ? a : 100;
        this.r = (r) ? r : 0;
        this.g = (g) ? g : 0;
        this.b = (b) ? b : 0;
    }

    validateAttr(pos: Position): void {
        if (this.a < this.min_a) {
            ErrorHandler.print_warning_mess(WarningType.COLOR_OPACITY_WARN, [this.min_a.toString()], pos)
            this.a = this.min_a
        } else if (this.a > this.max_a) {
            ErrorHandler.print_warning_mess(WarningType.COLOR_OPACITY_WARN, [this.max_a.toString()], pos)
            this.a = this.max_a
        }
        if (this.r < this.min_rgb) {
            ErrorHandler.print_warning_mess(WarningType.COLOR_COL_WARN, ["R", this.min_rgb.toString()], pos)
            this.r = this.min_rgb
        } else if (this.r > this.max_rgb) {
            ErrorHandler.print_warning_mess(WarningType.COLOR_COL_WARN, ["R", this.max_rgb.toString()], pos)
            this.r = this.max_rgb
        }
        if (this.g < this.min_rgb) {
            ErrorHandler.print_warning_mess(WarningType.COLOR_COL_WARN, ["G", this.min_rgb.toString()], pos)
            this.g = this.min_rgb
        } else if (this.g > this.max_rgb) {
            ErrorHandler.print_warning_mess(WarningType.COLOR_COL_WARN, ["G", this.max_rgb.toString()], pos)
            this.g = this.max_rgb
        }
        if (this.b < this.min_rgb) {
            ErrorHandler.print_warning_mess(WarningType.COLOR_COL_WARN, ["B", this.min_rgb.toString()], pos)
            this.b = this.min_rgb
        } else if (this.b > this.max_rgb) {
            this.b = this.max_rgb
            ErrorHandler.print_warning_mess(WarningType.COLOR_COL_WARN, ["B", this.max_rgb.toString()], pos)
        }
    }

    getA(){
        return this.a
    }

    getR(){
        return this.r
    }

    getG(){
        return this.g
    }

    getB(){
        return this.b
    }
}
