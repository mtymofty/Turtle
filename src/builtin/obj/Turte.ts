import { Position } from "../../source/Position";
import { ObjectInstance } from "./ObjectInstance";
import { Pen } from "./Pen";
import { TurtlePosition } from "./TurtlePosition";

export class Turtle implements ObjectInstance {
    pen: Pen
    position: TurtlePosition
    angle: number //0-359

    min_angle: number = 0
    max_angle: number = 359

    attr = {
        ["pen"]: this.getPen.bind(this),
        ["position"]: this.getPosition.bind(this),
        ["angle"]: this.getAngle.bind(this)
    }

    methods = {
        ["forward"]: this.forward.bind(this),
        ["left"]: this.left.bind(this),
        ["right"]: this.right.bind(this),
        ["rotate"]: this.rotate.bind(this)
    }


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

    validateAttr(_: Position): void {
        if (this.angle < this.min_angle) {
            this.angle = 360 + (this.angle % 360)
        } else if (this.angle > this.max_angle) {
            this.angle = this.angle % 360
        }
    }

    getPen() {
        return this.pen;
    }

    getPosition() {
        return this.position;
    }

    getAngle() {
        return this.angle;
    }
}
