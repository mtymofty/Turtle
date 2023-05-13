import { Visitator } from "../../visitator/Visitator";
import { Expression } from "./Expression";

export class Argument implements Expression {
    expression: Expression

    constructor(expression: Expression) {
        this.expression = expression;
    }

    accept(visitator: Visitator) {
        visitator.visitArgument(this)
    }

}