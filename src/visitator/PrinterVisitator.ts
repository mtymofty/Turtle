import { Block } from "../syntax/Block";
import { FunctionDef } from "../syntax/FunctionDef";
import { Identifier } from "../syntax/expression/Identifier";
import { IfStatement } from "../syntax/statement/IfStatement";
import { Parameter } from "../syntax/Parameter";
import { Program } from "../syntax/Program";
import { UnlessStatement } from "../syntax/statement/UnlessStatement";
import { WhileStatement } from "../syntax/statement/WhileStatement";
import { Visitator } from "./Visitator";
import { Constant } from "../syntax/expression/Constant";
import { ParenthExpression } from "../syntax/expression/ParenthExpression";
import { AssignStatement } from "../syntax/statement/AssignStatement";
import { MemberAccess } from "../syntax/expression/MemberAccess";
import { FunCall } from "../syntax/expression/FunCall";
import { Argument } from "../syntax/expression/Argument";

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

    visitConstant(constant: Constant) {
        this.print(`Constant: ${constant.value}\n`)
    }

    visitParenthExpression(p_ex: ParenthExpression) {
        this.print(`Parenthesis Expression: \n`)
        this.indent += this.indent_inc
        p_ex.expression.accept(this)
        this.indent -= this.indent_inc
    }

    visitAssignStatement(stmnt: AssignStatement) {
        this.print(`AssignStatement: \n`)
        this.indent += this.indent_inc
        stmnt.left.accept(this)
        stmnt.right.accept(this)
        this.indent -= this.indent_inc
    }

    visitFunCall(fun_call: FunCall) {
        this.print(`FunCall: ${fun_call.fun_name}\n`)
        this.indent += this.indent_inc
        fun_call.args.forEach(arg => {
            arg.accept(this)
        });
        this.indent -= this.indent_inc
    }

    visitMemberAccess(acc: MemberAccess) {
        this.print(`MemberAccess: \n`)
        this.indent += this.indent_inc
        acc.left.accept(this)
        acc.right.accept(this)
        this.indent -= this.indent_inc
    }

    visitArgument(arg: Argument) {
        this.print(`Argument: \n`)
        this.indent += this.indent_inc
        arg.expression.accept(this)
        this.indent -= this.indent_inc
    }

    print(mess: string){
        process.stdout.write('|' + '-'.repeat(this.indent) + mess);
    }
}