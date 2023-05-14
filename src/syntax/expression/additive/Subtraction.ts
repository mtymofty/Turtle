import { Visitor } from "../../../visitor/Visitor";
import { Expression } from "../Expression";

export class Subtraction implements Expression {
    left: Expression;
    right: Expression;

    constructor(left: Expression, right: Expression) {
        this.left = left;
        this.right = right;
    }

    accept(visitor: Visitor) {
        visitor.visitSubtraction(this)
    }
}
