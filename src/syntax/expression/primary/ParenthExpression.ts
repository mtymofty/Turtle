import { Visitor } from "../../../visitor/Visitor";
import { Expression } from "../Expression";

export class ParenthExpression implements Expression {
    expression: Expression;

    constructor(expression: Expression) {
        this.expression = expression;
    }

    accept(visitor: Visitor) {
        visitor.visitParenthExpression(this)
    }
}
