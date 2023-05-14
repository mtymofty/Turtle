import { Visitor } from "../../../visitor/Visitor";
import { Expression } from "../Expression";

export class LogicalNegation implements Expression {
    expr: Expression;

    constructor(expr: Expression) {
        this.expr = expr;
    }

    accept(visitor: Visitor) {
        visitor.visitLogicalNegation(this)
    }
}
