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
        ["pen"]:
                    {getter: this.getPen.bind(this),
                     setter: this.setPen.bind(this),
                     type: "Pen"},
        ["position"]:
                    {getter: this.getPosition.bind(this),
                     setter: this.setPosition.bind(this),
                     type: "TurtlePosition"},
        ["angle"]:
                    {getter: this.getAngle.bind(this),
                     setter: this.setAngle.bind(this),
                     type: "integer"},
    }

    methods: Record<string, [Function, Array<string>]>= {
        ["forward"]: [this.forward.bind(this), ["integer"]],
        ["left"]: [this.left.bind(this), []],
        ["right"]: [this.right.bind(this), []],
        ["rotate"]: [this.rotate.bind(this), ["integer"]]
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
        this.angle = this.angle + angle
        this.validateAttr(null)
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

    setPen(pen: Pen) {
        this.pen = pen;
    }

    getPosition() {
        return this.position;
    }

    setPosition(pos:TurtlePosition) {
        this.position = pos;
    }

    getAngle() {
        return this.angle;
    }

    setAngle(angle: number) {
        this.angle = angle
    }
}
