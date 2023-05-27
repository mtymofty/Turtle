import { Statement } from "./Statement";
import { Visitor } from "../../visitor/Visitor";
import { Expression } from "../expression/Expression";
import { Block } from "../Block";
import { Position } from "../../source/Position";

export class IfStatement implements Statement {
    condition: Expression;
    true_block: Block;
    false_block: Block;
    position: Position;

    constructor(condition: Expression, true_block: Block, false_block: Block, position: Position) {
        this.condition = condition;
        this.true_block = true_block;
        this.false_block = false_block;
        this.position = position;
    }

    accept(visitor: Visitor) {
        visitor.visitIfStatement(this)
    }
}
