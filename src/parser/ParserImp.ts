import { ErrorHandler } from "../error/ErrorHandler";
import { Lexer } from "../lexer/Lexer";
import { Block } from "./syntax/Block";
import { FunctionDef } from "./syntax/FunctionDef";
import { Program } from "./syntax/Program";
import { TokenType } from "../token/TokenType";
import { Statement } from "./syntax/statement/Statement";
import { ReturnStatement } from "./syntax/statement/ReturnStatement";
import { BreakStatement } from "./syntax/statement/BreakStatement";
import { ContinueStatement } from "./syntax/statement/ContinueStatement";
import { ErrorType, WarningType } from "../error/ErrorType";
import { IfStatement } from "./syntax/statement/IfStatement";
import { Identifier } from "./syntax/expression/primary/object_access/Identifier";
import { UnlessStatement } from "./syntax/statement/UnlessStatement";
import { WhileStatement } from "./syntax/statement/WhileStatement";
import { Expression } from "./syntax/expression/Expression";
import { Parser } from "./Parser";
import { AssignStatement } from "./syntax/statement/AssignStatement";
import { ObjectAccess } from "./syntax/expression/primary/object_access/ObjectAccess";
import { MemberAccess } from "./syntax/expression/primary/object_access/MemberAccess";
import { FunCall } from "./syntax/expression/primary/object_access/FunCall";
import { OrExpression } from "./syntax/expression/logical/OrExpression";
import { Negation } from "./syntax/expression/negation/Negation";
import { LogicalNegation } from "./syntax/expression/negation/LogicalNegation";
import { Exponentiation } from "./syntax/expression/Exponentiation";
import { Multiplication } from "./syntax/expression/multiplicative/Multiplication";
import { IntDivision } from "./syntax/expression/multiplicative/IntDivision";
import { Division } from "./syntax/expression/multiplicative/Division";
import { Modulo } from "./syntax/expression/multiplicative/Modulo";
import { Addition } from "./syntax/expression/additive/Addition";
import { Subtraction } from "./syntax/expression/additive/Subtraction";
import { EqualComparison } from "./syntax/expression/comparison/EqualComparison";
import { NotEqualComparison } from "./syntax/expression/comparison/NotEqualComparison";
import { GreaterComparison } from "./syntax/expression/comparison/GreaterComparison";
import { GreaterEqualComparison } from "./syntax/expression/comparison/GreaterEqualComparison";
import { LesserComparison } from "./syntax/expression/comparison/LesserComparison";
import { LesserEqualComparison } from "./syntax/expression/comparison/LesserEqualComparison";
import { AndExpression } from "./syntax/expression/logical/AndExpression";
import { BooleanConstant } from "./syntax/expression/primary/constant/BooleanConstant";
import { NullConstant } from "./syntax/expression/primary/constant/NullConstant";
import { IntConstant } from "./syntax/expression/primary/constant/IntConstant";
import { DoubleConstant } from "./syntax/expression/primary/constant/DoubleConstant";
import { StringConstant } from "./syntax/expression/primary/constant/StringConstant";

export class ParserImp implements Parser {
    lexer: Lexer

    private raised_error: boolean = false;

    constructor(lexer: Lexer) {
        this.lexer = lexer;
        this.lexer.next_token();
    }

    // program      = {instruction};
    // instruction  = fun_def;
    parse(): Program {
        var functions: Record<string, FunctionDef> = {}

        while (this.parseFunDef(functions)) {}

        if (this.lexer.token.type !== TokenType.EOF) {
            this.raise_critical_error(ErrorType.INVALID_TOKEN_ERR, [TokenType[this.lexer.token.type]])
        }

        return new Program(functions)
    }

    // fun_def = 'func', identifier, '(', [params], ')', statement_block;
    parseFunDef(functions: Record<string, FunctionDef>): boolean{
        let pos = this.lexer.token.pos
        if(!this.consumeIf(TokenType.FUN_KW)) {
            return false
        }

        this.mustBe(TokenType.IDENTIFIER, ErrorType.FUN_IDENTIFIER_ERR, []);

        var fun_name: string = this.lexer.token.value.toString()
        this.lexer.next_token()

        this.shouldBe(TokenType.L_BRACE_OP, ErrorType.PARAMS_LEFT_BRACE_ERR, []);

        var fun_params: Array<Identifier> = this.parseParams()

        this.shouldBe(TokenType.R_BRACE_OP, ErrorType.PARAMS_RIGHT_BRACE_ERR, []);

        var fun_block: Block = this.parseBlock(false)
        this.critErrorIfNull(fun_block, ErrorType.FUN_BLOCK_ERR, [])

        this.tryAddFunction(functions, fun_name, new FunctionDef(fun_name, fun_params, fun_block, pos))
        return true
    }

    // params = identifier, {",", identifier}
    parseParams(): Identifier[]  {
        var parameters: Identifier[] = new Array<Identifier>();
        var param: Identifier = this.parseParameter();

        if (param !== null) {
            this.tryAddParam(parameters, param)
            this.lexer.next_token()

            while(this.consumeIf(TokenType.COMMA_OP)) {
                param = this.parseParameter();
                if (param === null) {
                    this.print_error(ErrorType.PARAMS_COMMA_ERR, [])
                } else {
                    this.tryAddParam(parameters, param)
                    this.lexer.next_token()
                }
            }
        }
        return parameters
    }

    // identifier
    parseParameter(): Identifier {
        let pos = this.lexer.token.pos
        if (this.lexer.token.type !== TokenType.IDENTIFIER) {
            return null
        }
        var param_name: string = this.lexer.token.value.toString()
        return new Identifier(param_name, pos)

    }

    // statement_block = '{', {statement}, '}';
    parseBlock(in_loop: boolean): Block {
        let pos = this.lexer.token.pos
        if(!this.consumeIf(TokenType.L_C_BRACE_OP)) {
            return null
        }

        var statements: Statement[] = new Array<Statement>();

        if (!in_loop){
            var statement = this.parseStatement();
        } else {
            var statement = this.parseInsideLoopStatement();
        }

        while (statement !== null) {
            statements.push(statement)

            if (!in_loop) {
                statement = this.parseStatement();
            } else {
                statement = this.parseInsideLoopStatement();
            }
        }

        this.shouldBe(TokenType.R_C_BRACE_OP, ErrorType.BLOCK_END_ERR, []);

        return new Block(statements, pos)
    }

    // statement = simple_statement, terminator
    //             | compound_statement
    parseStatement(): Statement {
        return this.parseIfStatement() || this.parseWhileStatement()
               || this.parseSimpleStatement() || this.parseSimpleInLoopStatement()
    }

    parseInsideLoopStatement(): Statement {
        return this.parseStatement() || this.parseSimpleInLoopStatement()
    }

    // break and continue can only be successfully parsed inside a loop
    parseSimpleInLoopStatement(): Statement {
        var statement: Statement = this.parseBreakStatement() || this.parseContinueStatement()

        if (statement == null){
            return null
        }

        this.shouldBe(TokenType.TERMINATOR, ErrorType.TERMINATOR_ERR, []);
        return statement;
    }

    // simple_statement = obj_access, [assign_statement]
	//                    | return_statement
    parseSimpleStatement(): Statement {
        var statement: Statement = this.parseAssignOrObjectAccessStatement() || this.parseReturnStatement()

        if (statement == null){
            return null
        }

        this.shouldBe(TokenType.TERMINATOR, ErrorType.TERMINATOR_ERR, []);
        return statement;
    }

    // if_statement = if_kw, '(', expression, ')', statement_block,
	//                ['else', statement_block];
	// if_kw        = 'if' | 'unless';
    parseIfStatement(): Statement {
        let pos = this.lexer.token.pos
        if(!this.consumeIf(TokenType.IF_KW)) {
            var is_unless: boolean = true
            if(!this.consumeIf(TokenType.UNLESS_KW)) {
                return null
            }
        }

        this.shouldBe(TokenType.L_BRACE_OP, ErrorType.IF_LEFT_BRACE_ERR, []);

        var condition: Expression = this.parseExpression();
        this.critErrorIfNull(condition, ErrorType.IF_COND_ERR, [])

        this.shouldBe(TokenType.R_BRACE_OP, ErrorType.IF_RIGHT_BRACE_ERR, []);

        var if_block: Block = this.parseBlock(false)
        this.critErrorIfNull(if_block, ErrorType.IF_BLOCK_ERR, [])

        if(!this.consumeIf(TokenType.ELSE_KW)) {
            if (is_unless) {
                return new UnlessStatement(condition, if_block, null, pos)
            }
            return new IfStatement(condition, if_block, null, pos)
        }

        var else_block: Block = this.parseBlock(false)
        this.critErrorIfNull(else_block, ErrorType.ELSE_BLOCK_ERR, [])

        if (is_unless) {
            return new UnlessStatement(condition, if_block, else_block, pos)
        }
        return new IfStatement(condition, if_block, else_block, pos)

    }

    // while_statement = 'while', '(', expression, ')', statement_block
    parseWhileStatement(): Statement {
        let pos = this.lexer.token.pos
        if(!this.consumeIf(TokenType.WHILE_KW)) {
            return null
        }

        this.shouldBe(TokenType.L_BRACE_OP, ErrorType.WHILE_LEFT_BRACE_ERR, []);

        var condition: Expression = this.parseExpression();
        this.critErrorIfNull(condition, ErrorType.WHILE_COND_ERR, [])

        this.shouldBe(TokenType.R_BRACE_OP, ErrorType.WHILE_RIGHT_BRACE_ERR, []);

        var loop_block: Block = this.parseBlock(true)
        this.critErrorIfNull(loop_block, ErrorType.WHILE_BLOCK_ERR, [])

        return new WhileStatement(condition, loop_block, pos)
    }

    // obj_access, [assign_statement]
    parseAssignOrObjectAccessStatement(): Statement {
        var left: ObjectAccess = this.parseObjectAccess();
        if (left === null) {
            return null
        }

        let pos = this.lexer.token.pos
        if(!this.consumeIf(TokenType.ASSIGN_OP)) {
            if (left instanceof Identifier || (left instanceof MemberAccess && left.right instanceof Identifier)) {
                this.raise_critical_error(ErrorType.IDENT_MEM_ACCESS_ERR, [])
            }
            return left
        }

        var right: Expression = this.parseExpression()
        this.critErrorIfNull(right, ErrorType.ASSIGN_ERR, [])

        if (left instanceof Identifier  || (left instanceof MemberAccess && left.right instanceof Identifier)) {
            return new AssignStatement(left, right, pos)
        } else {
            this.raise_critical_error(ErrorType.FUN_METH_CALL_ERR, [])
        }
    }

    // obj_access = member {'.', member };
    parseObjectAccess(): ObjectAccess {
        var left: ObjectAccess = this.parseMember()
        if (left == null) {
            return null
        }

        let pos = this.lexer.token.pos
        while(this.consumeIf(TokenType.DOT_OP)) {
            var right: ObjectAccess = this.parseMember()
            this.critErrorIfNull(right, ErrorType.OBJ_ACC_ERR, [])

            left = new MemberAccess(left, right, pos)
        }
        return left
    }

    // member = identifier, ['(' [args] ')'];
    parseMember(): ObjectAccess {
        let pos = this.lexer.token.pos
        if (this.lexer.token.type !== TokenType.IDENTIFIER) {
            return null
        }

        var name: string = this.lexer.token.value.toString()
        this.lexer.next_token()

        let pos2 = this.lexer.token.pos
        if(!this.consumeIf(TokenType.L_BRACE_OP)) {
            return new Identifier(name, pos)
        }
        var args: Expression[] = this.parseArgs()

        this.shouldBe(TokenType.R_BRACE_OP, ErrorType.ARGS_RIGHT_BRACE_ERR, []);

        return new FunCall(name, args, pos2)
    }

    // args = expression, {",", expression};
    parseArgs(): Expression[] {
        var args: Expression[] = new Array<Expression>();
        var arg: Expression = this.parseArg();

        if (arg !== null) {
            args.push(arg)

            while(this.consumeIf(TokenType.COMMA_OP)) {
                var arg = this.parseArg();
                if (arg === null) {
                    this.print_error(ErrorType.ARGS_COMMA_ERR, [])
                } else {
                    args.push(arg)
                }
            }
        }
        return args
    }

    // expression
    parseArg(): Expression {
        var arg: Expression = this.parseExpression();
        if (arg == null) {
            return null
        }
        return arg
    }

    // return_statement    = 'return', [expression];
    parseReturnStatement(): Statement {
        let pos = this.lexer.token.pos
        if (this.lexer.token.type !== TokenType.RET_KW) {
            return null
        }
        this.lexer.next_token()

        var expr: Expression = this.parseExpression()

        return new ReturnStatement(pos, expr);
    }

    // 'break'
    parseBreakStatement(): Statement {
        let pos = this.lexer.token.pos
        if (this.lexer.token.type !== TokenType.BREAK_KW) {
            return null
        }
        this.lexer.next_token()

        return new BreakStatement(pos);
    }

    // 'continue'
    parseContinueStatement(): Statement {
        let pos = this.lexer.token.pos
        if (this.lexer.token.type !== TokenType.CONTINUE_KW) {
            return null
        }
        this.lexer.next_token()

        return new ContinueStatement(pos);
    }

    // expression = disjunction;
    parseExpression(): Expression {
        return this.parseDisjunction()
    }

    // disjunction = conjunction, {or_op, conjunction};
    parseDisjunction(): Expression {
        var left: Expression = this.parseConjunction()
        if (left == null) {
            return null
        }

        let pos = this.lexer.token.pos
        while(this.consumeIf(TokenType.OR_OP)) {
            var right: Expression = this.parseConjunction()
            this.critErrorIfNull(right, ErrorType.OR_EXPR_ERR, [])
            left = new OrExpression(left, right, pos)
        }
        return left
    }

    // conjunction = comparison, {and_op, comparison};
    parseConjunction(): Expression {
        var left: Expression = this.parseComparison()
        if (left == null) {
            return null
        }

        let pos = this.lexer.token.pos
        while(this.consumeIf(TokenType.AND_OP)) {
            var right: Expression = this.parseComparison()
            this.critErrorIfNull(right, ErrorType.OR_EXPR_ERR, [])
            left = new AndExpression(left, right, pos)
        }
        return left
    }

    // comparison = sum, [rel_op, sum];
    parseComparison(): Expression {
        var left: Expression = this.parseSumOrSubtr()
        if (left == null) {
            return null
        }

        var type;
        let pos = this.lexer.token.pos
        if(type = this.getTypeIfComp()) {
            var right: Expression = this.parseSumOrSubtr()
            this.critErrorIfNull(right, ErrorType.COMP_EXPR_ERR, [])
            left = new type(left, right, pos)
        }

        if(this.isTokenComp()) {
            this.raise_critical_error(ErrorType.COMP_NUM_ERR, [])
        }

        return left
    }

    // sum_sub = term, {add_op, term};
    parseSumOrSubtr(): Expression {
        var left: Expression = this.parseMultiplicationOrDivision()
        if (left == null) {
            return null
        }

        var types;
        let pos = this.lexer.token.pos
        while(types = this.getTypesIfAdd()) {
            var right: Expression = this.parseMultiplicationOrDivision()
            if (right == null) {
                this.raise_critical_error(types[1], [])
            }
            left = new types[0](left, right, pos)
        }
        return left
    }

    // term = factor, {mult_op, factor};
    parseMultiplicationOrDivision(): Expression {
        var left: Expression = this.parseNegation()
        if (left == null) {
            return null
        }

        var types;
        let pos = this.lexer.token.pos
        while(types = this.getTypesIfMult()) {
            var right: Expression = this.parseNegation()
            if (right == null) {
                this.raise_critical_error(types[1], [])
            }
            left = new types[0](left, right, pos)
        }
        return left
    }

    // factor = [unar_op], power;
    parseNegation(): Expression {
        var negation: boolean = false
        var log_negation: boolean = false
        let pos = this.lexer.token.pos
        if (this.consumeIf(TokenType.NOT_OP)) {
            log_negation = true
        } else if (this.consumeIf(TokenType.MINUS_OP)) {
                negation = true
        }

        var expr: Expression = this.parseExponentiation()

        if ((negation || log_negation) && (expr == null)) {
            this.raise_critical_error(ErrorType.NEG_EXPR_ERR, [])
        }

        if(negation) {
            return new Negation(expr, pos)
        } else if (log_negation) {
            return new LogicalNegation(expr, pos)
        } else {
            return expr
        }
    }

    // power = primary, {pow_op, primary};
    parseExponentiation(): Expression {
        var node: Expression = this.parsePrimary()
        if (node == null) {
            return null
        }
        var nodes = []
        nodes.push(node)

        let pos = this.lexer.token.pos
        while(this.consumeIf(TokenType.POW_OP)) {
            var node: Expression = this.parsePrimary()
            this.critErrorIfNull(node, ErrorType.EXP_EXPR_ERR, [])
            nodes.push(node)
        }
        var right = nodes.pop()
        nodes.reverse().forEach(node => {
            right = new Exponentiation(node, right, pos)
        });
        return right
    }

    // primary = parenth_expression | constant | obj_access;
    parsePrimary(): Expression {
        return this.parseObjectAccess()
               || this.parseConstant()
               || this.parseParenthExpression()
    }

    // constant = int | double | string | boolean | null;
    parseConstant(): Expression {
        if (this.lexer.token.type !== TokenType.INTEGER
            && this.lexer.token.type !== TokenType.DOUBLE
            && this.lexer.token.type !== TokenType.STRING
            && this.lexer.token.type !== TokenType.TRUE_KW
            && this.lexer.token.type !== TokenType.FALSE_KW
            && this.lexer.token.type !== TokenType.NULL_KW) {
            return null
        }

        var val = this.lexer.token.value
        let pos = this.lexer.token.pos

        if (this.lexer.token.type === TokenType.TRUE_KW) {
            this.lexer.next_token()
            return new BooleanConstant(true, pos)
        }
        if (this.lexer.token.type === TokenType.FALSE_KW) {
            this.lexer.next_token()
            return new BooleanConstant(false, pos)
        }
        if (this.lexer.token.type === TokenType.NULL_KW) {
            this.lexer.next_token()
            return new NullConstant(pos)
        }
        if (this.lexer.token.type === TokenType.INTEGER && typeof val === "number") {
            this.lexer.next_token()
            return new IntConstant(val, pos)
        }
        if (this.lexer.token.type === TokenType.DOUBLE && typeof val === "number") {
            this.lexer.next_token()
            return new DoubleConstant(val, pos)
        }
        if (this.lexer.token.type === TokenType.STRING && typeof val === "string") {
            this.lexer.next_token()
            return new StringConstant(val, pos)
        }
    }

    // parenth_expression = "(", expression, ")";
    parseParenthExpression(): Expression {
        if(!this.consumeIf(TokenType.L_BRACE_OP)) {
            return null
        }
        var expr: Expression = this.parseExpression()
        this.shouldBe(TokenType.R_BRACE_OP, ErrorType.PARENTH_RIGHT_BRACE_ERR, []);
        return expr
    }

    tryAddFunction(functions: Record<string, FunctionDef>, fun_name: string, fun_def: FunctionDef): void {
        if (functions[fun_name] !== undefined) {
            this.print_error(ErrorType.FUN_NAME_ERR, [fun_name])
            return
        }
        functions[fun_name] = fun_def
    }

    tryAddParam(parameters: Array<Identifier>, param: Identifier): void {
        for(let parameter of parameters){
            if (parameter.name == param.name){
                this.print_error(ErrorType.PARAM_NAME_ERR, [param.name])
                return
            }
        }
        parameters.push(param)
    }

    consumeIf(type: TokenType): boolean {
        if (this.lexer.token.type !== type) {
            return false
        }
        this.lexer.next_token()
        return true
    }

    isTokenComp(): boolean {
        if (this.lexer.token.type !== TokenType.EQ_OP
            && this.lexer.token.type !== TokenType.NEQ_OP
            && this.lexer.token.type !== TokenType.GRT_OP
            && this.lexer.token.type !== TokenType.GRT_EQ_OP
            && this.lexer.token.type !== TokenType.LESS_OP
            && this.lexer.token.type !== TokenType.LESS_EQ_OP) {
            return false
        }
        return true
    }

    getTypeIfComp() {
        let type: TokenType = this.lexer.token.type;
        if (type == TokenType.EQ_OP) {
            this.lexer.next_token()
            return EqualComparison
        } else if (type == TokenType.NEQ_OP) {
            this.lexer.next_token()
            return NotEqualComparison
        } else if (type == TokenType.GRT_OP) {
            this.lexer.next_token()
            return GreaterComparison
        } else if (type == TokenType.GRT_EQ_OP) {
            this.lexer.next_token()
            return GreaterEqualComparison
        } else if (type == TokenType.LESS_OP) {
            this.lexer.next_token()
            return LesserComparison
        } else if (type == TokenType.LESS_EQ_OP) {
            this.lexer.next_token()
            return LesserEqualComparison
        } else {
            return null
        }
    }

    getTypesIfMult() {
        let type: TokenType = this.lexer.token.type;
        if (type == TokenType.MULT_OP) {
            this.lexer.next_token()
            return [Multiplication, ErrorType.MULT_EXPR_ERR]
        } else if (type == TokenType.DIV_INT_OP) {
            this.lexer.next_token()
            return [IntDivision, ErrorType.INTDIV_EXPR_ERR]
        } else if (type == TokenType.DIV_OP) {
            this.lexer.next_token()
            return [Division, ErrorType.DIV_EXPR_ERR]
        } else if (type == TokenType.MOD_OP) {
            this.lexer.next_token()
            return [Modulo, ErrorType.MODULO_EXPR_ERR]
        } else {
            return null
        }
    }

    getTypesIfAdd() {
        let type: TokenType = this.lexer.token.type;
        if (type == TokenType.ADD_OP) {
            this.lexer.next_token()
            return [Addition, ErrorType.ADD_EXPR_ERR]
        } else if (type == TokenType.MINUS_OP) {
            this.lexer.next_token()
            return [Subtraction, ErrorType.SUB_EXPR_ERR]
        } else {
            return null
        }

    }

    print_warning(warn_type: WarningType, args: string[]): void {
        ErrorHandler.print_warning(this.lexer.token.pos, warn_type, args, this.lexer.get_reader())
    }

    print_error(err_type: ErrorType, args: string[]): void {
        ErrorHandler.print_error(this.lexer.token.pos, err_type, args, this.lexer.get_reader())
        this.raised_error = true;
    }

    raise_critical_error(err_type: ErrorType, args: string[]): void {
        this.print_error(err_type, args);
        ErrorHandler.abort(this.lexer.get_reader());
    }

    did_raise_error(): boolean {
        return this.raised_error;
    }

    private mustBe(tok_type: TokenType, err_type: ErrorType, args: string[]) {
        if (this.lexer.token.type !== tok_type) {
            this.raise_critical_error(err_type, args);
        }
    }

    private shouldBe(tok_type: TokenType, err_type: ErrorType, args: string[]) {
        if(!this.consumeIf(tok_type)) {
            this.print_error(err_type, args)
        }
    }

    private critErrorIfNull(node: Expression | Statement, err_type: ErrorType, args: string[]) {
        if (node == null) {
            this.raise_critical_error(err_type, args)
        }
    }
}
