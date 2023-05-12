import { Block } from "../syntax/Block";
import { FunctionDef } from "../syntax/FunctionDef";
import { Identifier } from "../syntax/Identifier";
import { IfStatement } from "../syntax/IfStatement";
import { Parameter } from "../syntax/Parameter";
import { Program } from "../syntax/Program";
import { UnlessStatement } from "../syntax/UnlessStatement";
import { WhileStatement } from "../syntax/WhileStatement";
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
        this.print(`Program:\n`)

        this.indent += this.indent_inc
        for (let fun_name in prog.functions) {
            let fun: FunctionDef = prog.functions[fun_name];
            fun.accept(this)
        }
        this.indent -= this.indent_inc
    }

    visitFunctionDef(fun: FunctionDef) {
        this.print(`Function definition (${fun.name}):\n`)

        this.indent += this.indent_inc
        fun.parameters.forEach(param => {
            param.accept(this)
        });

        fun.block.accept(this)
        this.indent -= this.indent_inc
    }

    visitParam(param: Parameter) {
        this.print(`Parameter (${param.name})\n`)
    }

    visitBlock(block: Block) {
        this.print("Block:\n")

        this.indent += this.indent_inc
        block.statements.forEach(statement => {
            statement.accept(this)
        });
        this.indent -= this.indent_inc
    }

    visitIfStatement(statement: IfStatement) {
        this.print(`If statement:\n`)

        this.indent += this.indent_inc
        this.visitCondStatement(statement)
        this.indent -= this.indent_inc
    }

    visitUnlessStatement(statement: UnlessStatement) {
        this.print(`Unless statement:\n`)

        this.indent += this.indent_inc
        this.visitCondStatement(statement)
        this.indent -= this.indent_inc
    }

    visitCondStatement(statement: IfStatement | UnlessStatement) {
        this.print(`Condition:\n`)
        this.indent += this.indent_inc
        statement.condition.accept(this)
        this.indent -= this.indent_inc

        this.print(`True:\n`)
        this.indent += this.indent_inc
        statement.true_block.accept(this)
        this.indent -= this.indent_inc

        if (statement.false_block != null) {
            this.print(`False:\n`)
            this.indent += this.indent_inc
            statement.false_block.accept(this)
            this.indent -= this.indent_inc
        }
    }

    visitWhileStatement(statement: WhileStatement) {
        this.print(`While statement:\n`)

        this.indent += this.indent_inc

        this.print(`Condition:\n`)
        this.indent += this.indent_inc
        statement.condition.accept(this)
        this.indent -= this.indent_inc

        this.print(`Loop:\n`)
        this.indent += this.indent_inc
        statement.loop_block.accept(this)
        this.indent -= this.indent_inc

        this.indent -= this.indent_inc
    }

    visitReturn() {
        this.print("Return\n")
    }

    visitBreak() {
        this.print("Break\n")
    }

    visitContinue() {
        this.print("Continue\n")
    }

    visitIdentifier(identifier: Identifier) {
        this.print(`Identifier: ${identifier.name}\n`)
    }

    print(mess: string){
        process.stdout.write('|' + '-'.repeat(this.indent) + mess);
    }
}