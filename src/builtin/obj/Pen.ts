import { Color } from "./Color";
import { ObjectInstance } from "./ObjectInstance";

export class Pen implements ObjectInstance {
    enabled: boolean
    color: Color

    constructor(color?: Color, enabled?: boolean) {
        this.color = (color) ? color : new Color();
        this.enabled = (enabled) ? enabled : true;
    }
}
