import { Visitor } from "../../../visitor/Visitor";
import { Expression } from "../Expression";

export class LesserEqualComparison implements Expression {
    left: Expression;
    right: Expression;

    constructor(left: Expression, right: Expression) {
        this.left = left;
        this.right = right;
    }

    accept(visitor: Visitor) {
        visitor.visitLesserEqualComparison(this)
    }
}
