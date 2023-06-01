import { Visitor } from "../visitor/Visitor";
import { Block } from "./Block";
import { Identifier } from "./expression/primary/object_access/Identifier";
import { Position } from "../source/Position";
import { Callable } from "../semantics/Callable";

export class FunctionDef implements Callable {
    name: string
    parameters: Array<Identifier>
    block: Block
    position: Position

    constructor(name: string, parameters: Array<Identifier>, block: Block, position: Position) {
        this.name = name
        this.parameters = parameters
        this.block = block
        this.position = position
    }

    accept(visitor: Visitor) {
        visitor.visitFunctionDef(this)
    }
}
