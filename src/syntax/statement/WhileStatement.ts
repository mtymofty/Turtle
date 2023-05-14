import { Statement } from "./Statement";
import { Visitor } from "../../visitor/Visitor";
import { Expression } from "../expression/Expression";
import { Block } from "../Block";

export class WhileStatement implements Statement {
    condition: Expression;
    loop_block: Block;

    constructor(condition: Expression, loop_block: Block) {
        this.condition = condition;
        this.loop_block = loop_block;
    }

    accept(visitor: Visitor) {
        visitor.visitWhileStatement(this)
    }
}
