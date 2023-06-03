import { Statement } from "./Statement";
import { Visitor } from "../../../visitor/Visitor";
import { Expression } from "../expression/Expression";
import { Block } from "../Block";
import { Position } from "../../../source/Position";

export class WhileStatement implements Statement {
    condition: Expression;
    loop_block: Block;
    position: Position

    constructor(condition: Expression, loop_block: Block, position: Position) {
        this.condition = condition;
        this.loop_block = loop_block;
        this.position = position;
    }

    accept(visitor: Visitor) {
        visitor.visitWhileStatement(this)
    }
}
