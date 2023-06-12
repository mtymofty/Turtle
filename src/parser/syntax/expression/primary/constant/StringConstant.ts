import { Position } from "../../../../../source/Position";
import { Visitor } from "../../../../../visitor/Visitor";
import { Expression } from "../../Expression";

export class StringConstant implements Expression {
    value: string;
    position: Position;

    constructor(value: string, position: Position) {
        this.value = value;
        this.position = position
    }

    accept(visitor: Visitor) {
        visitor.visitStringConstant(this)
    }
}
