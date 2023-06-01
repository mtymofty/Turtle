import { Statement } from "./Statement";
import { Visitor } from "../../visitor/Visitor";
import { Position } from "../../source/Position";
import { Expression } from "../expression/Expression";

export class ReturnStatement implements Statement {
    position: Position
    expression: Expression

    constructor(position: Position, expression: Expression) {
        this.position = position;
        this.expression = expression;
    }

    accept(visitor: Visitor) {
        visitor.visitReturn(this)
    }
}
