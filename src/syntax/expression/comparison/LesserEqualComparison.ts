import { Visitator } from "../../../visitator/Visitator";
import { Expression } from "../Expression";

export class LesserEqualComparison implements Expression {
    left: Expression;
    right: Expression;

    constructor(left: Expression, right: Expression) {
        this.left = left;
        this.right = right;
    }

    accept(visitator: Visitator) {
        visitator.visitLesserEqualComparison(this)
    }
}