import { Position } from "../../../../source/Position";
import { Visitor } from "../../../../visitor/Visitor";
import { Expression } from "../../Expression";

export class BooleanConstant implements Expression {
    value: boolean;
    position: Position;

    constructor(value: boolean, position: Position) {
        this.value = value;
        this.position = position;
    }

    accept(visitor: Visitor) {
        visitor.visitBooleanConstant(this)
    }
}
