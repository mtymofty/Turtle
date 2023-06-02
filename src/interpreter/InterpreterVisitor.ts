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
import { PrintFunction } from "../builtin/funs/PrintFunction";
import { ErrorType } from "../error/ErrorType";
import { Position } from "../source/Position";
import { ErrorUtils } from "../error/ErrorUtils";
import { Callable } from "../semantics/Callable";
import { Value } from "../semantics/Value";
import { Expression } from "../syntax/expression/Expression";
import { TypeMatching } from "../semantics/TypeMatching";
import { Evaluator } from "./Evaluator";
import { GreaterEqualComparison } from "../syntax/expression/comparison/GreaterEqualComparison";
import { ObjectInstance } from "../builtin/obj/ObjectInstance";
import { Color } from "../builtin/obj/Color";
import { Constructor } from "../builtin/obj/Constructor";
import { Pen } from "../builtin/obj/Pen";
import { Turtle } from "../builtin/obj/Turte";
import { TurtlePosition } from "../builtin/obj/TurtlePosition";

export class InterpreterVisitor implements Visitor {
    env: Environment
    callables: Record<string, Callable> = {}

    main_fun_name: string = "main"

    last_result: number | boolean | string | ObjectInstance | null = undefined
    is_returning: boolean = false
    is_breaking: boolean = false
    is_continuing: boolean = false

    constructor(env?: Environment) {
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
        this.callables["Color"] = new Constructor("Color",
                               [new Identifier("a", null), new Identifier("r", null), new Identifier("g", null), new Identifier("b", null)],
                               ["integer", "integer", "integer", "integer"],
                               Color);
        this.callables["Pen"] = new Constructor("Pen",
                             [new Identifier("enabled", null), new Identifier("color", null)],
                             ["boolean", "Color"],
                             Pen);
        this.callables["Turtle"] = new Constructor("Turtle",
                                [new Identifier("pen", null), new Identifier("position", null), new Identifier("angle", null)],
                                ["Pen", "TurtlePosition", "integer"],
                                Turtle);
        this.callables["Position"] = new Constructor("Position",
                                        [new Identifier("x", null), new Identifier("y", null)],
                                        ["integer", "integer"],
                                        TurtlePosition);
    }

    visitFunctionDef(fun: FunctionDef): void {
        fun.block.accept(this)
    }

    visitBlock(block: Block): void {
        for (let stmnt of block.statements) {
            stmnt.accept(this)
            if (this.is_returning === true || this.is_breaking === true || this.is_continuing === true) {
                break
            }
            this.last_result = undefined
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
        if (ret.expression !== null && ret.expression !== undefined) {
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
        let val: Value = this.env.find(ident.name)
        if (val === undefined) {
            this.raise_crit_err(ErrorType.VAR_UNDEF_ERR, [ident.name], ident.position)
        }
        this.last_result = val.value
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
        if(stmnt.left instanceof MemberAccess) {
        }

        if(stmnt.left instanceof Identifier) {
            var var_name = <string>stmnt.left.name
        }

        stmnt.right.accept(this)
        let val = this.last_result

        if (val === undefined) {
            val = null
        }

        this.last_result = undefined

        if(stmnt.left instanceof Identifier) {
            this.env.store(var_name, new Value(val))
        }
    }

    visitFunCall(fun_call: FunCall): void {
        let callable = this.callables[fun_call.fun_name]
        if (callable === null || callable === undefined) {
            this.raise_crit_err(ErrorType.FUN_UNDEF_ERR, [fun_call.fun_name], fun_call.position)

        }
        let args = this.getArgsAsValue(fun_call.args)

        if (callable instanceof Constructor){
            if (!this.validateArgsConstr(args, callable.parameters)) {
                this.raise_crit_err(ErrorType.ARGS_NUM_ERR, [fun_call.fun_name, callable.parameters.length.toString(), args.length.toString()], fun_call.position)
            }
            TypeMatching.checkTypes(args, callable.param_types, fun_call.position)
        } else {
            if (!this.validateArgsFun(args, callable.parameters)) {
                this.raise_crit_err(ErrorType.ARGS_NUM_ERR, [fun_call.fun_name, callable.parameters.length.toString(), args.length.toString()], fun_call.position)
            }
        }

        this.env.createFunCallContext()
        for (let i = 0; i < args.length; i++) {
            this.env.store(callable.parameters[i].name, args[i])
        }

        callable.accept(this)

        this.env.deleteFunCallContext()
        this.is_returning = false
    }

    visitMemberAccess(acc: MemberAccess): void {
    }

    private visitTwoArgOp(op, match_type, eval_type, err_type) {
        op.left.accept(this);
        let left = this.last_result;

        op.right.accept(this);
        let right = this.last_result;

        if (match_type(left, right)) {
            this.last_result = eval_type(left, right);
        } else {
            this.raise_crit_err(err_type, [TypeMatching.getTypeOf(left), TypeMatching.getTypeOf(right)], op.position);
        }
    }

    private visitNegs(neg, match_type, eval_type, err_type) {
        neg.expr.accept(this)
        let expr = this.last_result

        if(match_type(expr)) {
            this.last_result = eval_type(expr)
        } else {
            this.raise_crit_err(err_type, [TypeMatching.getTypeOf(expr)], neg.position)
        }
    }

    private visitDivs(op, match_type, eval_type, err_type) {
        op.left.accept(this);
        let left = this.last_result;

        op.right.accept(this);
        let right = this.last_result;

        if (match_type(left, right)) {
            this.last_result = eval_type(left, right, op.pos);
        } else {
            this.raise_crit_err(err_type, [TypeMatching.getTypeOf(left), TypeMatching.getTypeOf(right)], op.position);
        }
    }

    visitAddition(add: Addition): void {
        this.visitTwoArgOp(add, TypeMatching.matchesAdd, Evaluator.evaluateAdd, ErrorType.ADD_TYPE_ERR);
    }

    visitDivision(div: Division): void{
        this.visitDivs(div, TypeMatching.matchesArithm, Evaluator.evaluateDiv, ErrorType.DIV_TYPE_ERR);
    }

    visitMultiplication(mult: Multiplication): void{
        this.visitTwoArgOp(mult, TypeMatching.matchesArithm, Evaluator.evaluateMult, ErrorType.MULT_TYPE_ERR);
    }

    visitSubtraction(sub: Subtraction): void{
        this.visitTwoArgOp(sub, TypeMatching.matchesArithm, Evaluator.evaluateSubtr, ErrorType.SUBTR_TYPE_ERR);
    }

    visitExponentiation(exp: Exponentiation): void{
        this.visitTwoArgOp(exp, TypeMatching.matchesArithm, Evaluator.evaluateExp, ErrorType.EXP_TYPE_ERR);
    }

    visitLogicalNegation(neg: LogicalNegation): void{
        this.visitNegs(neg, TypeMatching.matchesLogNeg, Evaluator.evaluateLogNeg, ErrorType.LOG_NEG_TYPE_ERR)
    }

    visitNegation(neg: Negation): void{
        this.visitNegs(neg, TypeMatching.matchesNeg, Evaluator.evaluateNeg, ErrorType.NEG_TYPE_ERR)
    }

    visitIntDivision(div: IntDivision): void{
        this.visitDivs(div, TypeMatching.matchesArithm, Evaluator.evaluateIntDiv, ErrorType.INTDIV_TYPE_ERR);
    }

    visitModulo(mod: Modulo): void{
        this.visitDivs(mod, TypeMatching.matchesArithm, Evaluator.evaluateModulo, ErrorType.MOD_TYPE_ERR);
    }

    visitAndExpression(and: AndExpression): void{
        this.visitTwoArgOp(and, TypeMatching.matchesLog, Evaluator.evaluateAnd, ErrorType.AND_TYPE_ERR);
    }

    visitOrExpression(or: OrExpression): void{
        this.visitTwoArgOp(or, TypeMatching.matchesLog, Evaluator.evaluateOr, ErrorType.OR_TYPE_ERR);
    }

    visitGreaterComparison(comp: GreaterComparison): void{
        this.visitTwoArgOp(comp, TypeMatching.matchesComp, Evaluator.evaluateGrt, ErrorType.GRT_TYPE_ERR);
    }

    visitGreaterEqualComparison(comp: GreaterEqualComparison): void{
        this.visitTwoArgOp(comp, TypeMatching.matchesComp, Evaluator.evaluateGEq, ErrorType.GRTEQ_TYPE_ERR);
    }

    visitLesserComparison(comp: LesserComparison): void{
        this.visitTwoArgOp(comp, TypeMatching.matchesComp, Evaluator.evaluateLess, ErrorType.LESS_TYPE_ERR);
    }

    visitLesserEqualComparison(comp: LesserEqualComparison): void{
        this.visitTwoArgOp(comp, TypeMatching.matchesComp, Evaluator.evaluateLEq, ErrorType.LESSEQ_TYPE_ERR);
    }

    visitEqualComparison(comp: EqualComparison): void{
        this.visitTwoArgOp(comp, TypeMatching.matchesEq, Evaluator.evaluateEq, ErrorType.EQ_TYPE_ERR);
    }

    visitNotEqualComparison(comp: NotEqualComparison): void{
        this.visitTwoArgOp(comp, TypeMatching.matchesEq, Evaluator.evaluateNEq, ErrorType.NEQ_TYPE_ERR);
    }

    visitPrintFunction(fun: PrintFunction): void{
        let print_val = this.env.find(fun.parameters[0].name).value
        console.log(print_val)
    }

    visitConstr(constr: Constructor): void{
        var args = []
        constr.parameters.forEach(param => {
            args.push(this.env.find(param.name)?.value)
        });

        this.last_result = new constr.obj_type(...args)
    }

    getArgsAsValue(args: Expression[]): Value[] {
        var val_args: Value[] = []
        args.forEach(arg => {
            arg.accept(this)
            val_args.push(new Value(this.last_result))
        });

        this.last_result = undefined
        return val_args
    }

    validateArgsFun(args: Value[], params: Identifier[]): boolean {
        if (args.length !== params.length) {
            return false
        }
        return true

    }

    validateArgsConstr(args: Value[], params: Identifier[]): boolean {
        if (args.length !== params.length && args.length !== 0) {
            return false
        }
        return true

    }


    raise_crit_err(err_type: ErrorType, args: string[], pos: Position): void {
        ErrorHandler.print_err_pos(pos, err_type, args)
        ErrorHandler.abort();
    }

    raise_crit_err_mess(err_type: ErrorType): void {
        ErrorHandler.print_err_mess(ErrorUtils.error_mess[err_type])
        ErrorHandler.abort();
    }

}
