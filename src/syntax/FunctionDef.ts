import { Visitator } from "../visitator/Visitator";
import { Block } from "./Block";
import { Parameter } from "./Parameter";
import { Visitable } from "../visitator/Visitable";

export class FunctionDef implements Visitable {
    name: string
    parameters: Array<Parameter>
    block: Block

    constructor(name: string, parameters: Array<Parameter>, block: Block) {
        this.name = name
        this.parameters = parameters
        this.block = block
    }

    accept(visitator: Visitator) {
        visitator.visitFunctionDef(this)
    }
}