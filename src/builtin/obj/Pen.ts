import { Color } from "./Color";
import { ObjectInstance } from "./ObjectInstance";

export class Pen implements ObjectInstance {
    enabled: boolean
    color: Color

    constructor(enabled?: boolean, color?: Color, ) {
        this.color = (color) ? color : new Color();
        this.enabled = (enabled) ? enabled : true;
    }
}
