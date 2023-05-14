import { Visitor } from "../visitor/Visitor";
import { Block } from "./Block";
import { Parameter } from "./Parameter";
import { Visitable } from "../visitor/Visitable";

export class FunctionDef implements Visitable {
    name: string
    parameters: Array<Parameter>
    block: Block

    constructor(name: string, parameters: Array<Parameter>, block: Block) {
        this.name = name
        this.parameters = parameters
        this.block = block
    }

    accept(visitor: Visitor) {
        visitor.visitFunctionDef(this)
    }
}
