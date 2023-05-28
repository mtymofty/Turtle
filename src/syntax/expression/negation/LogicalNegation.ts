import { Position } from "../../../source/Position";
import { Visitor } from "../../../visitor/Visitor";
import { Expression } from "../Expression";

export class LogicalNegation implements Expression {
    expr: Expression;
    position: Position;

    constructor(expr: Expression, position: Position) {
        this.expr = expr;
        this.position = position;
    }

    accept(visitor: Visitor) {
        visitor.visitLogicalNegation(this)
    }
}
