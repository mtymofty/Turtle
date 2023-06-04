import { Block } from "../parser/syntax/Block";
import { FunctionDef } from "../parser/syntax/FunctionDef";
import { Identifier } from "../parser/syntax/expression/primary/object_access/Identifier";
import { IfStatement } from "../parser/syntax/statement/IfStatement";
import { Program } from "../parser/syntax/Program";
import { UnlessStatement } from "../parser/syntax/statement/UnlessStatement";
import { WhileStatement } from "../parser/syntax/statement/WhileStatement";
import { AssignStatement } from "../parser/syntax/statement/AssignStatement";
import { MemberAccess } from "../parser/syntax/expression/primary/object_access/MemberAccess";
import { FunCall } from "../parser/syntax/expression/primary/object_access/FunCall";
import { Addition } from "../parser/syntax/expression/additive/Addition";
import { Negation } from "../parser/syntax/expression/negation/Negation";
import { Division } from "../parser/syntax/expression/multiplicative/Division";
import { AndExpression } from "../parser/syntax/expression/AndExpression";
import { Multiplication } from "../parser/syntax/expression/multiplicative/Multiplication";
import { Subtraction } from "../parser/syntax/expression/additive/Subtraction";
import { Exponentiation } from "../parser/syntax/expression/Exponentiation";
import { LogicalNegation } from "../parser/syntax/expression/negation/LogicalNegation";
import { OrExpression } from "../parser/syntax/expression/OrExpression";
import { NotEqualComparison } from "../parser/syntax/expression/comparison/NotEqualComparison";
import { EqualComparison } from "../parser/syntax/expression/comparison/EqualComparison";
import { LesserEqualComparison } from "../parser/syntax/expression/comparison/LesserEqualComparison";
import { LesserComparison } from "../parser/syntax/expression/comparison/LesserComparison";
import { GreaterComparison } from "../parser/syntax/expression/comparison/GreaterComparison";
import { Modulo } from "../parser/syntax/expression/multiplicative/Modulo";
import { IntDivision } from "../parser/syntax/expression/multiplicative/IntDivision";
import { BooleanConstant } from "../parser/syntax/expression/primary/constant/BooleanConstant";
import { DoubleConstant } from "../parser/syntax/expression/primary/constant/DoubleConstant";
import { IntConstant } from "../parser/syntax/expression/primary/constant/IntConstant";
import { StringConstant } from "../parser/syntax/expression/primary/constant/StringConstant";
import { NullConstant } from "../parser/syntax/expression/primary/constant/NullConstant";
import { ReturnStatement } from "../parser/syntax/statement/ReturnStatement";
import { BreakStatement } from "../parser/syntax/statement/BreakStatement";
import { ContinueStatement } from "../parser/syntax/statement/ContinueStatement";
import { Visitor } from "../visitor/Visitor";
import { Environment } from "./env/Environment";
import { ErrorHandler } from "../error/ErrorHandler";
import { PrintFunction } from "./builtin/funs/PrintFunction";
import { ErrorType } from "../error/ErrorType";
import { Callable } from "./semantics/Callable";
import { Value } from "./semantics/Value";
import { Expression } from "../parser/syntax/expression/Expression";
import { TypeMatching } from "./TypeMatching";
import { Evaluator } from "./Evaluator";
import { GreaterEqualComparison } from "../parser/syntax/expression/comparison/GreaterEqualComparison";
import { ObjectInstance } from "./builtin/objs/ObjectInstance";
import { Color } from "./builtin/objs/Color";
import { Constructor } from "./builtin/objs/Constructor";
import { Pen } from "./builtin/objs/Pen";
import { Turtle } from "./builtin/objs/Turte";
import { TurtlePosition } from "./builtin/objs/TurtlePosition";
import { Position } from "../source/Position";

export class InterpreterVisitor implements Visitor {
    env: Environment
    callables: Record<string, Callable> = {}

    main_fun_name: string = "main"

    last_result: number | boolean | string | ObjectInstance | null = undefined
    is_returning: boolean = false
    is_breaking: boolean = false
    is_continuing: boolean = false
    in_loop: boolean = false

    constructor(env?: Environment) {
        this.env = (env) ? env : new Environment();
    }

    visitProgram(prog: Program): void {
        this.addFunctions(prog)
        this.addBuiltinFunctions()
        this.addBuiltinObjects()

        var main_fun = this.callables[this.main_fun_name]
        if (main_fun === null || main_fun === undefined) {
            ErrorHandler.raise_crit_err_mess(ErrorType.MAIN_FUN_ERR)
        }

        if (main_fun.parameters.length != 0) {
            ErrorHandler.raise_crit_err_mess(ErrorType.MAIN_PARAM_ERR)
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
                                ["Pen", "TurtlePosition", "number"],
                                Turtle);
        this.callables["TurtlePosition"] = new Constructor("TurtlePosition",
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

            if(this.in_loop === false && (this.is_breaking === true || this.is_continuing === true)){
                ErrorHandler.raise_crit_err(ErrorType.BREAK_CONT_ERR, [], stmnt.position)
            }

            if (this.is_returning === true || this.is_breaking === true || this.is_continuing === true) {
                break
            }


            this.last_result = undefined
        }
    }

    visitIfStatement(stmnt: IfStatement): void {
        stmnt.condition.accept(this)
        this.env.createScope()
        this.visitCondStatement(stmnt, this.last_result)
        this.env.deleteScope()
    }

    visitUnlessStatement(stmnt: UnlessStatement): void {
        stmnt.condition.accept(this)
        this.env.createScope()
        this.visitCondStatement(stmnt, !this.last_result)
        this.env.deleteScope()
    }

    visitCondStatement(stmnt: IfStatement | UnlessStatement, cond): void {
        if (cond) {
            this.last_result = undefined
            stmnt.true_block.accept(this)
        } else {
            if (stmnt.false_block !== null && stmnt.false_block !== undefined) {
                stmnt.false_block.accept(this)
            }
        }
    }

    visitWhileStatement(stmnt: WhileStatement): void {
        stmnt.condition.accept(this)

        this.env.createScope()
        this.in_loop = true
        while(this.last_result) {
            this.last_result = undefined
            stmnt.loop_block.accept(this)

            if (this.is_continuing == true) {
                this.is_continuing = false
                stmnt.condition.accept(this)
                continue
            }
            if (this.is_breaking == true) {
                this.is_breaking = false
                break
            }
            if (this.is_returning == true) {
                break
            }
            stmnt.condition.accept(this)
        }

        this.in_loop = false
        this.env.deleteScope()
    }

    visitReturn(ret: ReturnStatement): void {
        if (ret.expression !== null && ret.expression !== undefined) {
            ret.expression.accept(this)
        } else {
            this.last_result = null;
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
            ErrorHandler.raise_crit_err(ErrorType.VAR_UNDEF_ERR, [ident.name], ident.position)
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
        if(stmnt.left instanceof MemberAccess && stmnt.left.right instanceof Identifier) {
            stmnt.left.left.accept(this)
            var obj = this.last_result
            var var_name = stmnt.left.right.name
        }

        if(stmnt.left instanceof Identifier) {
            var var_name = stmnt.left.name
        }

        stmnt.right.accept(this)
        let val = this.last_result

        if (val === undefined) {
            val = null
        }

        this.last_result = undefined

        if(stmnt.left instanceof MemberAccess && TypeMatching.isObjectInstance(obj)) {
            //@ts-ignore typescript nie wykrywa sprawdzenia typu obj
            var obj_attr = obj.attr[var_name];
            if (obj_attr === undefined) {
                ErrorHandler.raise_crit_err(ErrorType.OBJ_PROP_ERR, [var_name, TypeMatching.getTypeOf(obj)], stmnt.left.position);
            }
            TypeMatching.checkAssignType(val, obj_attr.type, var_name, stmnt.right.position)

            obj_attr.setter(val)

            //@ts-ignore
            obj.validateAttr(stmnt.right.position)
        }




        if(stmnt.left instanceof Identifier) {
            this.env.store(var_name, new Value(val))
        }
    }

    visitFunCall(fun_call: FunCall): void {
        let callable = this.callables[fun_call.fun_name]
        if (callable === null || callable === undefined) {
            ErrorHandler.raise_crit_err(ErrorType.FUN_UNDEF_ERR, [fun_call.fun_name], fun_call.position)

        }
        let args = this.getArgsAsValue(fun_call.args)

        if (callable instanceof Constructor){
            if (!this.validateArgsConstr(args, callable.parameters)) {
                ErrorHandler.raise_crit_err(ErrorType.ARGS_NUM_ERR, [fun_call.fun_name, callable.parameters.length.toString(), args.length.toString()], fun_call.position)
            }
            TypeMatching.checkTypes(args, callable.param_types, fun_call.position)
        } else {
            if (!this.validateArgsFun(args, callable.parameters)) {
                ErrorHandler.raise_crit_err(ErrorType.ARGS_NUM_ERR, [fun_call.fun_name, callable.parameters.length.toString(), args.length.toString()], fun_call.position)
            }
        }

        this.env.createFunCallContext()
        for (let i = 0; i < args.length; i++) {
            this.env.store(callable.parameters[i].name, args[i])
        }

        callable.accept(this)

        if (callable instanceof Constructor && TypeMatching.isObjectInstance(this.last_result)){
            //@ts-ignore - typescript nie wykrywa sprawdzenia czy last_result jest obiektem
            this.last_result.validateAttr(fun_call.position)
        }

        this.env.deleteFunCallContext()
        this.is_returning = false
    }

    visitMemberAccess(acc: MemberAccess): void {
        acc.left.accept(this)
        if (acc.right instanceof Identifier) {
            if(!TypeMatching.isObjectInstance(this.last_result)) {
                ErrorHandler.raise_crit_err(ErrorType.OBJ_MEM_ACC_ERR, [TypeMatching.getTypeOf(this.last_result)], acc.left.position);
            } else {
                //@ts-ignore - typescript nie wykrywa sprawdzenia czy last_result jest obiektem
                var right_mem_attr = this.last_result.attr[acc.right.name];
                if (right_mem_attr === undefined) {
                    ErrorHandler.raise_crit_err(ErrorType.OBJ_PROP_ERR, [acc.right.name, TypeMatching.getTypeOf(this.last_result)], acc.right.position);
                }
                this.last_result = right_mem_attr.getter()
            }
        } else if (acc.right instanceof FunCall) {
            this.visitMethCall(acc.right, acc.left.position)
        }
    }

    visitMethCall(method_call: FunCall, pos: Position): void {
        if(!TypeMatching.isObjectInstance(this.last_result)) {
            ErrorHandler.raise_crit_err(ErrorType.OBJ_MEM_ACC_ERR, [TypeMatching.getTypeOf(this.last_result)], pos);
        } else {
            //@ts-ignore
            var method_attr = this.last_result.methods[method_call.fun_name];
            if (method_attr === undefined) {
                ErrorHandler.raise_crit_err(ErrorType.OBJ_METH_ERR, [method_call.fun_name, TypeMatching.getTypeOf(this.last_result)], method_call.position);
            }
        }

        let args = this.getArgsAsValue(method_call.args)

        if (!this.validateArgsFun(args, method_attr[1])) {
            ErrorHandler.raise_crit_err(ErrorType.ARGS_NUM_ERR, [method_call.fun_name, method_attr[1].length.toString(), args.length.toString()], method_call.position)
        }

        TypeMatching.checkTypes(args, method_attr[1], method_call.position)

        var arg_values = args.map(arg => {
            return arg.value
        })

        this.last_result = method_attr[0](...arg_values)
    }

    private visitTwoArgOp(op, match_type, eval_type, err_type) {
        op.left.accept(this);
        let left = this.last_result;

        op.right.accept(this);
        let right = this.last_result;

        if (match_type(left, right)) {
            this.last_result = eval_type(left, right, op.position);
        } else {
            ErrorHandler.raise_crit_err(err_type, [TypeMatching.getTypeOf(left), TypeMatching.getTypeOf(right)], op.position);
        }
    }

    private visitNegs(neg, match_type, eval_type, err_type) {
        neg.expr.accept(this)
        let expr = this.last_result

        if(match_type(expr)) {
            this.last_result = eval_type(expr)
        } else {
            ErrorHandler.raise_crit_err(err_type, [TypeMatching.getTypeOf(expr)], neg.position)
        }
    }

    visitAddition(add: Addition): void {
        this.visitTwoArgOp(add, TypeMatching.matchesAdd, Evaluator.evaluateAdd, ErrorType.ADD_TYPE_ERR);
    }

    visitDivision(div: Division): void{
        this.visitTwoArgOp(div, TypeMatching.matchesArithm, Evaluator.evaluateDiv, ErrorType.DIV_TYPE_ERR);
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
        this.visitTwoArgOp(div, TypeMatching.matchesArithm, Evaluator.evaluateIntDiv, ErrorType.INTDIV_TYPE_ERR);
    }

    visitModulo(mod: Modulo): void{
        this.visitTwoArgOp(mod, TypeMatching.matchesArithm, Evaluator.evaluateModulo, ErrorType.MOD_TYPE_ERR);
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
        let printable = Value.getPrintable(print_val)
        console.log(printable)
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

    validateArgsMeth(args: Value[], params: Identifier[]): boolean {
        if (args.length !== params.length) {
            return false
        }
        return true
    }
}
