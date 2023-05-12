import { Block } from "../syntax/Block";
import { FunctionDef } from "../syntax/FunctionDef";
import { Parameter } from "../syntax/Parameter";
import { Program } from "../syntax/Program";
import { Visitator } from "./Visitator";

export class PrinterVisitator implements Visitator {
    indent: number
    indent_inc: number
    constructor(indent?: number, indent_inc?: number) {
        this.indent = (indent) ? indent : 0;
        this.indent_inc = (indent_inc) ? indent_inc : 2;
    }

    visit() {
    }

    visitProgram(prog: Program) {
        this.print(`Program:`)

        this.indent += this.indent_inc
        for (let fun_name in prog.functions) {
            let fun: FunctionDef = prog.functions[fun_name];
            fun.accept(this)
        }
        this.indent -= this.indent_inc
    }

    visitFunctionDef(fun: FunctionDef) {
        this.print(`Function definition (${fun.name}):`)

        this.indent += this.indent_inc
        fun.parameters.forEach(param => {
            param.accept(this)
        });

        fun.block.accept(this)
        this.indent -= this.indent_inc
    }

    visitParam(param: Parameter) {
        this.print(`Parameter (${param.name})`)
    }

    visitBlock(block: Block) {
        this.print("Block:")

        this.indent += this.indent_inc
        block.statements.forEach(statement => {
            statement.accept(this)
        });
        this.indent -= this.indent_inc
    }

    visitIfStatement() {
    }

    visitReturn() {
        this.print("Return")
    }

    visitBreak() {
        this.print("Break")
    }

    visitContinue() {
        this.print("Continue")
    }

    print(mess: string){
        console.log('|' + '-'.repeat(this.indent) + mess);
    }
}