import { Block } from "../syntax/Block";
import { FunctionDef } from "../syntax/FunctionDef";
import { Identifier } from "../syntax/expression/primary/object_access/Identifier";
import { IfStatement } from "../syntax/statement/IfStatement";
import { Parameter } from "../syntax/Parameter";
import { Program } from "../syntax/Program";
import { UnlessStatement } from "../syntax/statement/UnlessStatement";
import { WhileStatement } from "../syntax/statement/WhileStatement";
import { Visitator } from "./Visitator";
import { ParenthExpression } from "../syntax/expression/primary/ParenthExpression";
import { AssignStatement } from "../syntax/statement/AssignStatement";
import { MemberAccess } from "../syntax/expression/primary/object_access/MemberAccess";
import { FunCall } from "../syntax/expression/primary/object_access/FunCall";
import { Argument } from "../syntax/expression/Argument";
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
import { TrueConstant } from "../syntax/expression/primary/constant/TrueConstant";
import { FalseConstant } from "../syntax/expression/primary/constant/FalseConstant";
import { DoubleConstant } from "../syntax/expression/primary/constant/DoubleConstant";
import { IntConstant } from "../syntax/expression/primary/constant/IntConstant";
import { StringConstant } from "../syntax/expression/primary/constant/StringConstant";
import { NullConstant } from "../syntax/expression/primary/constant/NullConstant";

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


    visitDoubleConstant(constant: DoubleConstant) {
        this.print(`Constant: ${constant.value}\n`)
    }

    visitIntConstant(constant: IntConstant) {
        this.print(`Constant: ${constant.value}\n`)
    }

    visitStringConstant(constant: StringConstant) {
        this.print(`Constant: ${constant.value}\n`)
    }

    visitNullConstant(constant: NullConstant) {
        this.print(`Constant: null\n`)
    }

    visitFalseConstant(constant: FalseConstant) {
        this.print(`False Constant: false\n`)
    }

    visitTrueConstant(constant: TrueConstant) {
        this.print(`True Constant: true\n`)
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

    visitAddition(add: Addition) {
        this.print(`Addition: \n`)
        this.indent += this.indent_inc
        add.left.accept(this)
        add.right.accept(this)
        this.indent -= this.indent_inc
    }

    visitAndExpression(and: AndExpression){
        this.print(`Conjunction: \n`)
        this.indent += this.indent_inc
        and.left.accept(this)
        and.right.accept(this)
        this.indent -= this.indent_inc
    }

    visitDivision(div: Division){
        this.print(`Division: \n`)
        this.indent += this.indent_inc
        div.left.accept(this)
        div.right.accept(this)
        this.indent -= this.indent_inc
    }

    visitMultiplication(mult: Multiplication){
        this.print(`Multiplication: \n`)
        this.indent += this.indent_inc
        mult.left.accept(this)
        mult.right.accept(this)
        this.indent -= this.indent_inc
    }

    visitSubtraction(sub: Subtraction){
        this.print(`Subtraction: \n`)
        this.indent += this.indent_inc
        sub.left.accept(this)
        sub.right.accept(this)
        this.indent -= this.indent_inc
    }

    visitExponentiation(exp: Exponentiation){
        this.print(`Exponentiation: \n`)
        this.indent += this.indent_inc
        exp.left.accept(this)
        exp.right.accept(this)
        this.indent -= this.indent_inc
    }

    visitLogicalNegation(l_neg: LogicalNegation){
        this.print(`Logical Negation: \n`)
        this.indent += this.indent_inc
        l_neg.expr.accept(this)
        this.indent -= this.indent_inc
    }

    visitOrExpression(or: OrExpression){
        this.print(`Disjunction: \n`)
        this.indent += this.indent_inc
        or.left.accept(this)
        or.right.accept(this)
        this.indent -= this.indent_inc
    }

    visitNegation(neg: Negation){
        this.print(`Negation: \n`)
        this.indent += this.indent_inc
        neg.expr.accept(this)
        this.indent -= this.indent_inc
    }

    visitIntDivision(int_div: IntDivision){
        this.print(`Integer Division: \n`)
        this.indent += this.indent_inc
        int_div.left.accept(this)
        int_div.right.accept(this)
        this.indent -= this.indent_inc
    }

    visitModulo(mod: Modulo){
        this.print(`Modulo: \n`)
        this.indent += this.indent_inc
        mod.left.accept(this)
        mod.right.accept(this)
        this.indent -= this.indent_inc
    }

    visitGreaterComparison(comp: OrExpression){
        this.print(`Greater Comparison: \n`)
        this.indent += this.indent_inc
        comp.left.accept(this)
        comp.right.accept(this)
        this.indent -= this.indent_inc
    }

    visitGreaterEqualComparison(comp: GreaterComparison){
        this.print(`Greater or Equal Comparison: \n`)
        this.indent += this.indent_inc
        comp.left.accept(this)
        comp.right.accept(this)
        this.indent -= this.indent_inc
    }

    visitLesserComparison(comp: LesserComparison){
        this.print(`Lesser Comparison: \n`)
        this.indent += this.indent_inc
        comp.left.accept(this)
        comp.right.accept(this)
        this.indent -= this.indent_inc
    }

    visitLesserEqualComparison(comp: LesserEqualComparison){
        this.print(`Lesser or Equal Comparison: \n`)
        this.indent += this.indent_inc
        comp.left.accept(this)
        comp.right.accept(this)
        this.indent -= this.indent_inc
    }

    visitEqualComparison(comp: EqualComparison){
        this.print(`Equal Comparison: \n`)
        this.indent += this.indent_inc
        comp.left.accept(this)
        comp.right.accept(this)
        this.indent -= this.indent_inc
    }

    visitNotEqualComparison(comp: NotEqualComparison){
        this.print(`Not Equal Comparison: \n`)
        this.indent += this.indent_inc
        comp.left.accept(this)
        comp.right.accept(this)
        this.indent -= this.indent_inc
    }


    print(mess: string){
        process.stdout.write('|' + '-'.repeat(this.indent) + mess);
    }
}