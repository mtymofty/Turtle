import { Visitor } from "../../../visitor/Visitor";
import { Expression } from "../Expression";

export class Negation implements Expression {
    expr: Expression;

    constructor(expr: Expression) {
        this.expr = expr;
    }

    accept(visitor: Visitor) {
        visitor.visitNegation(this)
    }
}
