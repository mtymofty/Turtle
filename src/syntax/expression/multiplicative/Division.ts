import { Visitator } from "../../../visitator/Visitator";
import { Expression } from "../Expression";

export class Division implements Expression {
    left: Expression;
    right: Expression;

    constructor(left: Expression, right: Expression) {
        this.left = left;
        this.right = right;
    }

    accept(visitator: Visitator) {
        visitator.visitDivision(this)
    }
}