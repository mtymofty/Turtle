import { Visitor } from "../../visitor/Visitor";
import { Expression } from "./Expression";

export class Argument implements Expression {
    expression: Expression

    constructor(expression: Expression) {
        this.expression = expression;
    }

    accept(visitor: Visitor) {
        visitor.visitArgument(this)
    }
}
