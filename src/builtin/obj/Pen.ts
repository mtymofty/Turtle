import { Position } from "../../source/Position";
import { Color } from "./Color";
import { ObjectInstance } from "./ObjectInstance";

export class Pen implements ObjectInstance {
    enabled: boolean
    color: Color

    attr = {
        ["enabled"]:
                    {getter: this.getEnabled.bind(this),
                    setter: this.setEnabled.bind(this),
                    type: "boolean"},
        ["color"]:
                    {getter: this.getColor.bind(this),
                     setter: this.setColor.bind(this),
                     type: "Color"},
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

    setEnabled(enabled: boolean){
        this.enabled = enabled;
    }

    getColor(){
        return this.color
    }

    setColor(color: Color){
        this.color = color
    }
}
