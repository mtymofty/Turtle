import { Visitable } from "../visitor/Visitable";
import { Visitor } from "../visitor/Visitor";
import { Statement } from "./statement/Statement";

export class Block implements Visitable{
    statements: Array<Statement>

    constructor(statements: Array<Statement>) {
        this.statements = statements
    }

    accept(visitor: Visitor) {
        visitor.visitBlock(this)
    }
}
