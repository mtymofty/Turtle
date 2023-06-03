import { Position } from "../../source/Position";
import { Visitable } from "../../visitor/Visitable";
import { Visitor } from "../../visitor/Visitor";
import { Statement } from "./statement/Statement";

export class Block implements Visitable{
    statements: Array<Statement>
    position: Position

    constructor(statements: Array<Statement>, position: Position) {
        this.statements = statements
        this.position = position
    }

    accept(visitor: Visitor) {
        visitor.visitBlock(this)
    }
}
