import { Visitor } from "../visitor/Visitor";
import { Block } from "./Block";
import { Visitable } from "../visitor/Visitable";
import { Identifier } from "./expression/primary/object_access/Identifier";
import { Position } from "../source/Position";

export class FunctionDef implements Visitable {
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
