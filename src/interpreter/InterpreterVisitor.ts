import { Block } from "../syntax/Block";
import { FunctionDef } from "../syntax/FunctionDef";
import { Identifier } from "../syntax/expression/primary/object_access/Identifier";
import { IfStatement } from "../syntax/statement/IfStatement";
import { Program } from "../syntax/Program";
import { UnlessStatement } from "../syntax/statement/UnlessStatement";
import { WhileStatement } from "../syntax/statement/WhileStatement";
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
import { Visitor } from "../visitor/Visitor";
import { Environment } from "./env/Environment";
import { ErrorHandler } from "../error/ErrorHandler";
import { PrintFunction } from "../builtin/PrintFunction";
import { ErrorType } from "../error/ErrorType";
import { Position } from "../source/Position";
import { ErrorUtils } from "../error/ErrorUtils";
import { Callable } from "../semantics/Callable";
import { Value } from "../semantics/Value";

export class InterpreterVisitor implements Visitor {
    env: Environment
    error_handler: ErrorHandler
    callables: Record<string, Callable> = {}

    main_fun_name: string = "main"

    last_result: Value = null
    is_returning: boolean = false
    is_breaking: boolean = false
    is_continuing: boolean = false

    constructor(error_handler: ErrorHandler, env?: Environment) {
        this.error_handler = error_handler;
        this.env = (env) ? env : new Environment();
    }

    visitProgram(prog: Program): void {
        this.addFunctions(prog)
        this.addBuiltinFunctions()
        this.addBuiltinObjects()

        var main_fun = this.callables[this.main_fun_name]
        if (main_fun === null || main_fun === undefined) {
            this.raise_crit_err_mess(ErrorType.MAIN_FUN_ERR)
        }

        if (main_fun.parameters.length != 0) {
            this.raise_crit_err_mess(ErrorType.MAIN_PARAM_ERR)
        }

        this.env.createFunCallContext()
        this.callables["main"].accept(this)

    }

    addFunctions(prog: Program) {
        for (const fun_name in prog.functions) {
            this.callables[fun_name] = prog.functions[fun_name];
        }
    }

    addBuiltinFunctions() {
        this.callables["print"] = new PrintFunction();
    }

    addBuiltinObjects() {
    }

    visitFunctionDef(fun: FunctionDef): void {
        // this.last_result = null
        fun.block.accept(this)
    }

    visitBlock(block: Block): void {
        for (let stmnt of block.statements) {
            stmnt.accept(this)
            if (this.is_returning || this.is_breaking || this.is_continuing) {
                break
            }
        }
    }

    visitIfStatement(stmnt: IfStatement): void {
    }

    visitUnlessStatement(stmnt: UnlessStatement): void {
    }

    visitCondStatement(stmnt: IfStatement | UnlessStatement): void {
    }

    visitWhileStatement(stmnt: WhileStatement): void {
    }

    visitReturn(ret: ReturnStatement): void {
        if (ret.expression) {
            ret.expression.accept(this)
        }
        this.is_returning = true

    }

    visitBreak(_: BreakStatement): void {
        this.is_breaking = true
    }

    visitContinue(_: ContinueStatement): void {
        this.is_continuing = true
    }

    visitIdentifier(ident: Identifier): void {
    }

    visitDoubleConstant(cons: DoubleConstant): void {
        this.last_result = cons.value
    }

    visitIntConstant(cons: IntConstant): void {
        this.last_result = cons.value
    }

    visitStringConstant(cons: StringConstant): void {
        this.last_result = cons.value
    }

    visitNullConstant(cons: NullConstant): void {
        this.last_result = cons.value
    }

    visitBooleanConstant(cons: BooleanConstant): void {
        this.last_result = cons.value
    }

    visitAssignStatement(stmnt: AssignStatement): void {
    }

    visitFunCall(fun_call: FunCall): void {
    }

    visitMemberAccess(acc: MemberAccess): void {
    }

    visitAddition(add: Addition): void {
    }

    visitAndExpression(and: AndExpression): void{
    }

    visitDivision(div: Division): void{
    }

    visitMultiplication(mult: Multiplication): void{
    }

    visitSubtraction(sub: Subtraction): void{
    }

    visitExponentiation(exp: Exponentiation): void{
    }

    visitLogicalNegation(l_neg: LogicalNegation): void{
    }

    visitOrExpression(or: OrExpression): void{
    }

    visitNegation(neg: Negation): void{
    }

    visitIntDivision(int_div: IntDivision): void{
    }

    visitModulo(mod: Modulo): void{
    }

    visitGreaterComparison(comp: OrExpression): void{
    }

    visitGreaterEqualComparison(comp: GreaterComparison): void{
    }

    visitLesserComparison(comp: LesserComparison): void{
    }

    visitLesserEqualComparison(comp: LesserEqualComparison): void{
    }

    visitEqualComparison(comp: EqualComparison): void{
    }

    visitNotEqualComparison(comp: NotEqualComparison): void{
    }

    visitPrintFunction(fun: PrintFunction): void{

    }

    print_error(err_type: ErrorType, args: string[], pos: Position): void {
        this.error_handler.print_error(pos, err_type, args)
    }

    raise_crit_err(err_type: ErrorType, args: string[], pos: Position): void {
        this.print_error(err_type, args, pos);
        this.error_handler.abort();
    }

    raise_crit_err_mess(err_type: ErrorType): void {
        this.error_handler.print_err_mess(ErrorUtils.error_mess[err_type])
        this.error_handler.abort();
    }

}
