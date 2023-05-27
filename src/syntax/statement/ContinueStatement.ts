import { Statement } from "./Statement";
import { Visitor } from "../../visitor/Visitor";
import { Position } from "../../source/Position";

export class ContinueStatement implements Statement {
    position: Position

    constructor(position: Position) {
        this.position = position;
    }

    accept(visitor: Visitor) {
        visitor.visitContinue(this)
    }
}
