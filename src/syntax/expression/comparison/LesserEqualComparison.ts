import { Position } from "../../../source/Position";
import { Visitor } from "../../../visitor/Visitor";
import { Expression } from "../Expression";

export class LesserEqualComparison implements Expression {
    left: Expression;
    right: Expression;
    position: Position;

    constructor(left: Expression, right: Expression, position: Position) {
        this.left = left;
        this.right = right;
        this.position = position;
    }

    accept(visitor: Visitor) {
        visitor.visitLesserEqualComparison(this)
    }
}
