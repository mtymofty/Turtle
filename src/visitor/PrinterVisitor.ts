import { Block } from "../syntax/Block";
import { FunctionDef } from "../syntax/FunctionDef";
import { Identifier } from "../syntax/expression/primary/object_access/Identifier";
import { IfStatement } from "../syntax/statement/IfStatement";
import { Program } from "../syntax/Program";
import { UnlessStatement } from "../syntax/statement/UnlessStatement";
import { WhileStatement } from "../syntax/statement/WhileStatement";
import { Visitor } from "./Visitor";
import { AssignStatement } from "../syntax/statement/AssignStatement";
import { MemberAccess } from "../syntax/expression/primary/object_access/MemberAccess";
import { FunCall } from "../syntax/expression/primary/object_access/FunCall";
import { Addition } from "../syntax/expression/additive/Addition";
import { Negation } from "../syntax/expression/negation/Negation";
import { Division } from "../syntax/expression/multiplicative/Division";
import { AndExpression } from "../syntax/expression/AndExpression";
import { Multiplication } from "../syntax/expression/multiplicative/Multiplication";
import { Subtraction } from "../syntax/expression/additive/Subtraction";
import { Exponentiation } from "../syntax/expression/Exponentiation";
import { LogicalNegation } from "../syntax/expression/negation/LogicalNegation";
import { OrExpression } from "../syntax/expression/OrExpression";
import { NotEqualComparison } from "../syntax/expression/comparison/NotEqualComparison";
import { EqualComparison } from "../syntax/expression/comparison/EqualComparison";
import { LesserEqualComparison } from "../syntax/expression/comparison/LesserEqualComparison";
import { LesserComparison } from "../syntax/expression/comparison/LesserComparison";
import { GreaterComparison } from "../syntax/expression/comparison/GreaterComparison";
import { Modulo } from "../syntax/expression/multiplicative/Modulo";
import { IntDivision } from "../syntax/expression/multiplicative/IntDivision";
import { BooleanConstant } from "../syntax/expression/primary/constant/BooleanConstant";
import { DoubleConstant } from "../syntax/expression/primary/constant/DoubleConstant";
import { IntConstant } from "../syntax/expression/primary/constant/IntConstant";
import { StringConstant } from "../syntax/expression/primary/constant/StringConstant";
import { NullConstant } from "../syntax/expression/primary/constant/NullConstant";
import { ReturnStatement } from "../syntax/statement/ReturnStatement";
import { BreakStatement } from "../syntax/statement/BreakStatement";
import { ContinueStatement } from "../syntax/statement/ContinueStatement";
import { PrintFunction } from "../builtin/funs/PrintFunction";
import { GreaterEqualComparison } from "../syntax/expression/comparison/GreaterEqualComparison";
import { Constructor } from "../builtin/obj/Constructor";

export class PrinterVisitor implements Visitor {
    indent: number
    indent_inc: number
    constructor(indent?: number, indent_inc?: number) {
        this.indent = (indent) ? indent : 0;
        this.indent_inc = (indent_inc) ? indent_inc : 2;
    }

    visitProgram(prog: Program): void {
        this.print(`Program:\n`)

        this.indent += this.indent_inc
        for (let fun_name in prog.functions) {
            let fun: FunctionDef = prog.functions[fun_name];
            fun.accept(this)
        }
        this.indent -= this.indent_inc
    }

    visitFunctionDef(fun: FunctionDef): void {
        this.print(`Function definition [line: ${fun.position.line} col: ${fun.position.col}] (${fun.name}):\n`)

        this.indent += this.indent_inc
        fun.parameters.forEach(param => {
            param.accept(this)
        });

        fun.block.accept(this)
        this.indent -= this.indent_inc
    }

    visitBlock(block: Block): void {
        this.print(`Block [line: ${block.position.line} col: ${block.position.col}]:\n`)

        this.indent += this.indent_inc
        block.statements.forEach(statement => {
            statement.accept(this)
        });
        this.indent -= this.indent_inc
    }

    visitIfStatement(statement: IfStatement): void {
        this.print(`If statement [line: ${statement.position.line} col: ${statement.position.col}]:\n`)

        this.indent += this.indent_inc
        this.visitCondStatement(statement)
        this.indent -= this.indent_inc
    }

    visitUnlessStatement(statement: UnlessStatement): void {
        this.print(`Unless statement [line: ${statement.position.line} col: ${statement.position.col}]:\n`)

        this.indent += this.indent_inc
        this.visitCondStatement(statement)
        this.indent -= this.indent_inc
    }

    visitCondStatement(statement: IfStatement | UnlessStatement): void {
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

    visitWhileStatement(statement: WhileStatement): void {
        this.print(`While statement [line: ${statement.position.line} col: ${statement.position.col}]:\n`)

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

    visitReturn(ret: ReturnStatement): void {
        this.print(`Return [line: ${ret.position.line} col: ${ret.position.col}]: \n`)
        if (ret.expression !== null) {
            this.indent += this.indent_inc
            ret.expression.accept(this)
            this.indent -= this.indent_inc
        }

    }

    visitBreak(br: BreakStatement): void {
        this.print(`Break [line: ${br.position.line} col: ${br.position.col}]\n`)
    }

    visitContinue(cont: ContinueStatement): void {
        this.print(`Continue [line: ${cont.position.line} col: ${cont.position.col}]\n`)
    }

    visitIdentifier(identifier: Identifier): void {
        this.print(`Identifier [line: ${identifier.position.line} col: ${identifier.position.col}]: ${identifier.name}\n`)
    }

    visitDoubleConstant(constant: DoubleConstant): void {
        this.print(`Double Constant [line: ${constant.position.line} col: ${constant.position.col}]: ${constant.value}\n`)
    }

    visitIntConstant(constant: IntConstant): void {
        this.print(`Integer Constant [line: ${constant.position.line} col: ${constant.position.col}]: ${constant.value}\n`)
    }

    visitStringConstant(constant: StringConstant): void {
        this.print(`String Constant [line: ${constant.position.line} col: ${constant.position.col}]: ${constant.value}\n`)
    }

    visitNullConstant(null_: NullConstant): void {
        this.print(`Null Constant [line: ${null_.position.line} col: ${null_.position.col}]: null\n`)
    }

    visitBooleanConstant(constant: BooleanConstant): void {
        this.print(`Boolean Constant [line: ${constant.position.line} col: ${constant.position.col}]: ${constant.value}\n`)
    }

    visitAssignStatement(stmnt: AssignStatement): void {
        this.print(`AssignStatement [line: ${stmnt.position.line} col: ${stmnt.position.col}]: \n`)
        this.indent += this.indent_inc
        stmnt.left.accept(this)
        stmnt.right.accept(this)
        this.indent -= this.indent_inc
    }

    visitFunCall(fun_call: FunCall): void {
        this.print(`FunCall [line: ${fun_call.position.line} col: ${fun_call.position.col}]: ${fun_call.fun_name}\n`)
        this.indent += this.indent_inc
        fun_call.args.forEach(arg => {
            arg.accept(this)
        });
        this.indent -= this.indent_inc
    }

    visitMemberAccess(acc: MemberAccess): void {
        this.print(`MemberAccess [line: ${acc.position.line} col: ${acc.position.col}]: \n`)
        this.indent += this.indent_inc
        this.print(`--left-- `)
        acc.left.accept(this)
        this.print(`--right-- `)
        acc.right.accept(this)
        this.indent -= this.indent_inc
    }

    visitAddition(add: Addition): void {
        this.print(`Addition [line: ${add.position.line} col: ${add.position.col}]: \n`)
        this.indent += this.indent_inc
        add.left.accept(this)
        add.right.accept(this)
        this.indent -= this.indent_inc
    }

    visitAndExpression(and: AndExpression): void{
        this.print(`Conjunction [line: ${and.position.line} col: ${and.position.col}]: \n`)
        this.indent += this.indent_inc
        and.left.accept(this)
        and.right.accept(this)
        this.indent -= this.indent_inc
    }

    visitDivision(div: Division): void{
        this.print(`Division [line: ${div.position.line} col: ${div.position.col}]: \n`)
        this.indent += this.indent_inc
        div.left.accept(this)
        div.right.accept(this)
        this.indent -= this.indent_inc
    }

    visitMultiplication(mult: Multiplication): void{
        this.print(`Multiplication [line: ${mult.position.line} col: ${mult.position.col}]: \n`)
        this.indent += this.indent_inc
        mult.left.accept(this)
        mult.right.accept(this)
        this.indent -= this.indent_inc
    }

    visitSubtraction(sub: Subtraction): void{
        this.print(`Subtraction [line: ${sub.position.line} col: ${sub.position.col}]: \n`)
        this.indent += this.indent_inc
        sub.left.accept(this)
        sub.right.accept(this)
        this.indent -= this.indent_inc
    }

    visitExponentiation(exp: Exponentiation): void{
        this.print(`Exponentiation [line: ${exp.position.line} col: ${exp.position.col}]: \n`)
        this.indent += this.indent_inc
        exp.left.accept(this)
        exp.right.accept(this)
        this.indent -= this.indent_inc
    }

    visitLogicalNegation(l_neg: LogicalNegation): void{
        this.print(`Logical Negation [line: ${l_neg.position.line} col: ${l_neg.position.col}]: \n`)
        this.indent += this.indent_inc
        l_neg.expr.accept(this)
        this.indent -= this.indent_inc
    }

    visitOrExpression(or: OrExpression): void{
        this.print(`Disjunction [line: ${or.position.line} col: ${or.position.col}]: \n`)
        this.indent += this.indent_inc
        or.left.accept(this)
        or.right.accept(this)
        this.indent -= this.indent_inc
    }

    visitNegation(neg: Negation): void{
        this.print(`Negation [line: ${neg.position.line} col: ${neg.position.col}]: \n`)
        this.indent += this.indent_inc
        neg.expr.accept(this)
        this.indent -= this.indent_inc
    }

    visitIntDivision(int_div: IntDivision): void{
        this.print(`Integer Division [line: ${int_div.position.line} col: ${int_div.position.col}]: \n`)
        this.indent += this.indent_inc
        int_div.left.accept(this)
        int_div.right.accept(this)
        this.indent -= this.indent_inc
    }

    visitModulo(mod: Modulo): void{
        this.print(`Modulo [line: ${mod.position.line} col: ${mod.position.col}]: \n`)
        this.indent += this.indent_inc
        mod.left.accept(this)
        mod.right.accept(this)
        this.indent -= this.indent_inc
    }

    visitGreaterComparison(comp: GreaterComparison): void{
        this.print(`Greater Comparison [line: ${comp.position.line} col: ${comp.position.col}]: \n`)
        this.indent += this.indent_inc
        comp.left.accept(this)
        comp.right.accept(this)
        this.indent -= this.indent_inc
    }

    visitGreaterEqualComparison(comp: GreaterEqualComparison): void{
        this.print(`Greater or Equal Comparison [line: ${comp.position.line} col: ${comp.position.col}]: \n`)
        this.indent += this.indent_inc
        comp.left.accept(this)
        comp.right.accept(this)
        this.indent -= this.indent_inc
    }

    visitLesserComparison(comp: LesserComparison): void{
        this.print(`Lesser Comparison [line: ${comp.position.line} col: ${comp.position.col}]: \n`)
        this.indent += this.indent_inc
        comp.left.accept(this)
        comp.right.accept(this)
        this.indent -= this.indent_inc
    }

    visitLesserEqualComparison(comp: LesserEqualComparison): void{
        this.print(`Lesser or Equal Comparison [line: ${comp.position.line} col: ${comp.position.col}]: \n`)
        this.indent += this.indent_inc
        comp.left.accept(this)
        comp.right.accept(this)
        this.indent -= this.indent_inc
    }

    visitEqualComparison(comp: EqualComparison): void{
        this.print(`Equal Comparison [line: ${comp.position.line} col: ${comp.position.col}]: \n`)
        this.indent += this.indent_inc
        comp.left.accept(this)
        comp.right.accept(this)
        this.indent -= this.indent_inc
    }

    visitNotEqualComparison(comp: NotEqualComparison): void{
        this.print(`Not Equal Comparison [line: ${comp.position.line} col: ${comp.position.col}]: \n`)
        this.indent += this.indent_inc
        comp.left.accept(this)
        comp.right.accept(this)
        this.indent -= this.indent_inc
    }

    visitPrintFunction(_: PrintFunction): void{
    }

    visitConstr(_: Constructor): void{
    }


    print(mess: string){
        process.stdout.write('|' + '-'.repeat(this.indent) + mess);
    }
}
