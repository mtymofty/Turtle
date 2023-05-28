import { Position } from "../../../../source/Position";
import { Visitor } from "../../../../visitor/Visitor";
import { Expression } from "../../Expression";

export class DoubleConstant implements Expression {
    value: number;
    position: Position;

    constructor(value: number, position: Position) {
        this.value = value;
        this.position = position
    }

    accept(visitor: Visitor) {
        visitor.visitDoubleConstant(this)
    }
}
