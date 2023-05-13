import { Visitable } from "../visitator/Visitable";
import { Visitator } from "../visitator/Visitator";
import { Statement } from "./statement/Statement";

export class Block implements Visitable{
    statements: Array<Statement>

    constructor(statements: Array<Statement>) {
        this.statements = statements
    }

    accept(visitator: Visitator) {
        visitator.visitBlock(this)
    }
}