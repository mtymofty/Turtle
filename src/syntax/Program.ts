import { Visitator } from "../visitator/Visitator";
import { FunctionDef } from "./FunctionDef";
import { Visitable } from "../visitator/Visitable";

export class Program implements Visitable {
    functions: Record<string, FunctionDef>

    constructor(functions: Record<string, FunctionDef>) {
        this.functions = functions
    }

    accept(visitator: Visitator) {
        visitator.visitProgram(this)
    }


}