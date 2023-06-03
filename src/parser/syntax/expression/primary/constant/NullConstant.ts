import { Position } from "../../../../../source/Position";
import { Visitor } from "../../../../../visitor/Visitor";
import { Expression } from "../../Expression";

export class NullConstant implements Expression {
    value: null;
    position: Position;

    constructor(position: Position) {
        this.value = null;
        this.position = position
    }

    accept(visitor: Visitor) {
        visitor.visitNullConstant(this)
    }
}
