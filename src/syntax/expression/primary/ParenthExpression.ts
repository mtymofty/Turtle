import { Visitable } from "../../../visitator/Visitable";
import { Visitator } from "../../../visitator/Visitator";
import { Expression } from "../Expression";

export class ParenthExpression implements Expression {
    expression: Expression;

    constructor(expression: Expression) {
        this.expression = expression;
    }

    accept(visitator: Visitator) {
        visitator.visitParenthExpression(this)
    }

}