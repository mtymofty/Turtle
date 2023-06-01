import { Color } from "./Color";

export class Pen {
    enabled: boolean
    color: Color

    constructor(color?: Color, enabled?: boolean) {
        this.color = (color) ? color : new Color();
        this.enabled = (enabled) ? enabled : true;
    }
}
