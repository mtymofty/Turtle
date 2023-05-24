import { Visitor } from "../visitor/Visitor";
import { Block } from "./Block";
import { Visitable } from "../visitor/Visitable";
import { Identifier } from "./expression/primary/object_access/Identifier";

export class FunctionDef implements Visitable {
    name: string
    parameters: Array<Identifier>
    block: Block

    constructor(name: string, parameters: Array<Identifier>, block: Block) {
        this.name = name
        this.parameters = parameters
        this.block = block
    }

    accept(visitor: Visitor) {
        visitor.visitFunctionDef(this)
    }
}
