import { Visitator } from "../../../visitator/Visitator";
import { Expression } from "../Expression";

export class Negation implements Expression {
    expr: Expression;

    constructor(expr: Expression) {
        this.expr = expr;
    }

    accept(visitator: Visitator) {
        visitator.visitNegation(this)
    }
}