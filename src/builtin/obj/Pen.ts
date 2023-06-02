import { Position } from "../../source/Position";
import { Color } from "./Color";
import { ObjectInstance } from "./ObjectInstance";

export class Pen implements ObjectInstance {
    enabled: boolean
    color: Color

    attr = {
        ["enabled"]: this.getEnabled.bind(this),
        ["color"]: this.getColor.bind(this)
    }

    methods = {}

    constructor(enabled?: boolean, color?: Color, ) {
        this.color = (color) ? color : new Color();
        this.enabled = (enabled) ? enabled : true;
    }

    validateAttr(_: Position): void {}

    getEnabled(){
        return this.enabled
    }

    getColor(){
        return this.color
    }
}
