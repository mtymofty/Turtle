import { Visitor } from "../visitor/Visitor";
import { FunctionDef } from "./FunctionDef";
import { Visitable } from "../visitor/Visitable";

export class Program implements Visitable {
    functions: Record<string, FunctionDef>

    constructor(functions: Record<string, FunctionDef>) {
        this.functions = functions
    }

    accept(visitor: Visitor) {
        visitor.visitProgram(this)
    }
}
