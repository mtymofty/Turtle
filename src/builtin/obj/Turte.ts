import { ObjectInstance } from "./ObjectInstance";
import { Pen } from "./Pen";
import { TurtlePosition } from "./TurtlePosition";

export class Turtle implements ObjectInstance {
    pen: Pen
    position: TurtlePosition
    angle: number //0-359

    constructor(pen?: Pen, position?: TurtlePosition, angle?: number) {
        this.pen = (pen) ? pen : new Pen();
        this.position = (position) ? position : new TurtlePosition();
        this.angle = (angle) ? angle : 0;
    }

    forward(length: number) {
        if (this.pen.enabled) {
            // rysuje linię prostą o długości length
        } else {
            // przesuwa się o długość length
        }
    }

    right() {
        this.rotate(90)
    }

    left() {
        this.rotate(-90)
    }

    rotate(angle: number) {
        this.angle = (this.angle + angle) % 360
    }
}
