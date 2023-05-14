import { Statement } from "./Statement";
import { Visitor } from "../../visitor/Visitor";
import { Expression } from "../expression/Expression";
import { Block } from "../Block";

export class IfStatement implements Statement {
    condition: Expression;
    true_block: Block;
    false_block: Block;

    constructor(condition: Expression, true_block: Block, false_block: Block) {
        this.condition = condition;
        this.true_block = true_block;
        this.false_block = false_block;
    }

    accept(visitor: Visitor) {
        visitor.visitIfStatement(this)
    }
}
