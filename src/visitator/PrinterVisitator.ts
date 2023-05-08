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

        var count: number = 0;

        for (let _ in prog.functions) {
            count += 1
        }

        console.log('-'.repeat(this.indent) + `Program - number of functions: ${count}`);

        this.indent += this.indent_inc
        for (let fun_name in prog.functions) {
            let fun: FunctionDef = prog.functions[fun_name];
            fun.accept(this)
        }
        this.indent -= this.indent_inc
    }

    visitFunctionDef(fun: FunctionDef) {
        console.log('-'.repeat(this.indent) + `Function ${fun.name} - number of parameters: ${fun.parameters.length}`);

        this.indent += this.indent_inc
        fun.parameters.forEach(param => {
            param.accept(this)
        });
        fun.block.accept(this)
        this.indent -= this.indent_inc
    }

    visitParam(param: Parameter) {
        console.log('-'.repeat(this.indent) + `Parameter: ${param.name}`)
    }

    visitBlock(block: Block) {
        console.log('-'.repeat(this.indent) + `Statement Block`);

        this.indent += this.indent_inc
        block.statements.forEach(statement => {
            statement.accept(this)
        });
        this.indent -= this.indent_inc
    }

    visitIfStatement() {
    }

    visitReturn() {
    }

    visitBreak() {
    }
}