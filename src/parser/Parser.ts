import { ErrorHandler } from "../error/ErrorHandler";
import { Lexer } from "../lexer/Lexer";
import { Block } from "../syntax/Block";
import { FunctionDef } from "../syntax/FunctionDef";
import { Parameter } from "../syntax/Parameter";
import { Program } from "../syntax/Program";
import { TokenType } from "../token/TokenType";
import { Statement } from "../syntax/Statement";
import { ReturnStatement } from "../syntax/ReturnStatement";
import { BreakStatement } from "../syntax/BreakStatement";
import { ContinueStatement } from "../syntax/ContinueStatement";
import { ErrorType, WarningType } from "../error/ErrorType";
import { ErrorUtils } from "../error/ErrorUtils";
import { IfStatement } from "../syntax/IfStatement";
import { Identifier } from "../syntax/Identifier";
import { UnlessStatement } from "../syntax/UnlessStatement";
import { WhileStatement } from "../syntax/WhileStatement";

export class Parser {
    lexer: Lexer
    error_handler: ErrorHandler

    private raised_error: boolean = false;

    constructor(lexer: Lexer, error_handler: ErrorHandler) {
        this.lexer = lexer;
        this.error_handler = error_handler;
        this.lexer.next_token();

    }

    parse(): Program {
        var functions: Record<string, FunctionDef> = {}

        while (this.parseFunDef(functions)) {}

        if (this.lexer.token.type !== TokenType.EOF) {
            this.raise_critical_error(ErrorType.INVALID_TOKEN_ERR, [TokenType[this.lexer.token.type]])
        }
        this.lexer.get_reader().abort();
        return new Program(functions)
    }

    parseFunDef(functions: Record<string, FunctionDef>): boolean{
        if(!this.consumeIf(TokenType.FUN_KW)) {
            return false
        }

        if (this.lexer.token.type !== TokenType.IDENTIFIER) {
            this.raise_critical_error(ErrorType.FUN_IDENTIFIER_ERR, [])
        }

        var fun_name: string = this.lexer.token.value.toString()
        this.lexer.next_token()

        if(!this.consumeIf(TokenType.L_BRACE_OP)) {
            this.print_error(ErrorType.PARAMS_LEFT_BRACE_ERR, [])
        }

        var fun_params: Array<Parameter> = this.parseParams()

        if(!this.consumeIf(TokenType.R_BRACE_OP)) {
            this.print_error(ErrorType.PARAMS_RIGHT_BRACE_ERR, [])
        }

        var fun_block = this.parseBlock(false)

        if (fun_block == null) {
            this.raise_critical_error(ErrorType.FUN_BLOCK_ERR, [])
        }

        this.tryAddFunction(functions, fun_name, new FunctionDef(fun_name, fun_params, fun_block))
        return true
    }

    parseParams() {
        var parameters = new Array<Parameter>();
        var param = this.parseParameter();

        if (param != null) {
            this.tryAddParam(parameters, param)
            this.lexer.next_token()

            while(this.consumeIf(TokenType.COMMA_OP)) {
                var param = this.parseParameter();
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

    parseParameter() {
        if (this.lexer.token.type !== TokenType.IDENTIFIER) {
            return null
        }
        var param_name: string = this.lexer.token.value.toString()
        return new Parameter(param_name)

    }

    parseBlock(in_loop: boolean) {
        if(!this.consumeIf(TokenType.L_C_BRACE_OP)) {
            return null
        }

        var statements = new Array<Statement>();

        if (in_loop){
            var statement = this.parseStatement();
        } else {
            var statement = this.parseInsideLoopStatement();
        }

        while (statement != null) {
            console.log("parseBlock(): dodaje statement")
            statements.push(statement)

            if (in_loop){
            var statement = this.parseStatement();
            } else {
                var statement = this.parseInsideLoopStatement();
            }
        }

        console.log("parseBlock(): liczba statementów: " + statements.length)

        if(!this.consumeIf(TokenType.R_C_BRACE_OP)) {
            this.print_error(ErrorType.BLOCK_END_ERR, [])
        }
        console.log("parseBlock(): prawy curly brace")

        return new Block(statements)
    }

    parseStatement(): Statement {
        return this.parseIfStatement() || this.parseWhileStatement()
               || this.parseSimpleStatement()
    }

    parseInsideLoopStatement(): Statement {
        return this.parseStatement() || this.parseBreakStatement() || this.parseContinueStatement()
    }

    parseSimpleStatement(): Statement {
        var statement: Statement = this.parseAssignOrFunctionCallStatement() || this.parseReturnStatement()

        if (statement == null){
            return null
        }

        this.lexer.next_token()

        if(!this.consumeIf(TokenType.TERMINATOR)) {
            this.print_error(ErrorType.TERMINATOR_ERR, [])
        }
        return statement;
    }

    parseIfStatement(): Statement {
        if(!this.consumeIf(TokenType.IF_KW)) {
            var is_unless = true
            if(!this.consumeIf(TokenType.UNLESS_KW)) {
                return null
            }
        }

        if(!this.consumeIf(TokenType.L_BRACE_OP)) {
            this.print_error(ErrorType.IF_LEFT_BRACE_ERR, [])
        }

        var condition = this.parseExpression();

        if (condition == null) {
            this.raise_critical_error(ErrorType.IF_COND_ERR, [])
        }
        this.lexer.next_token()

        if(!this.consumeIf(TokenType.R_BRACE_OP)) {
            this.print_error(ErrorType.IF_RIGHT_BRACE_ERR, [])
        }

        var if_block = this.parseBlock(false)

        if (if_block == null) {
            this.raise_critical_error(ErrorType.IF_BLOCK_ERR, [])
        }

        if(!this.consumeIf(TokenType.ELSE_KW)) {
            return new IfStatement(condition, if_block, null)
        }

        var else_block = this.parseBlock(false)

        if (else_block == null) {
            this.raise_critical_error(ErrorType.ELSE_BLOCK_ERR, [])
        }

        if (is_unless) {
            return new UnlessStatement(condition, if_block, else_block)
        }
        return new IfStatement(condition, if_block, else_block)

    }

    parseWhileStatement() {
        if(!this.consumeIf(TokenType.WHILE_KW)) {
            return null
        }

        if(!this.consumeIf(TokenType.L_BRACE_OP)) {
            this.print_error(ErrorType.WHILE_LEFT_BRACE_ERR, [])
        }

        var condition = this.parseExpression();

        if (condition == null) {
            this.raise_critical_error(ErrorType.WHILE_COND_ERR, [])
        }
        this.lexer.next_token()

        if(!this.consumeIf(TokenType.R_BRACE_OP)) {
            this.print_error(ErrorType.WHILE_RIGHT_BRACE_ERR, [])
        }

        var loop_block = this.parseBlock(true)

        if (loop_block == null) {
            this.raise_critical_error(ErrorType.WHILE_BLOCK_ERR, [])
        }

        return new WhileStatement(condition, loop_block)
    }

    parseAssignOrFunctionCallStatement() {
        if (this.lexer.token.type !== TokenType.RET_KW) {
            return null
        }
        return new ReturnStatement()
    }


    parseReturnStatement() {
        if (this.lexer.token.type !== TokenType.RET_KW) {
            return null
        }

        return new ReturnStatement();
    }

    parseBreakStatement() {
        if (this.lexer.token.type !== TokenType.BREAK_KW) {
            return null
        }

        return new BreakStatement();
    }

    parseContinueStatement() {
        if (this.lexer.token.type !== TokenType.CONTINUE_KW) {
            return null
        }

        return new ContinueStatement();
    }

    parseExpression() {
        if (this.lexer.token.type !== TokenType.RET_KW) {
            return null
        }
        return new ReturnStatement()
    }

    tryAddFunction(functions: Record<string, FunctionDef>, fun_name: string, fun_def: FunctionDef) {
        if (functions[fun_name] !== undefined) {
            this.print_error(ErrorType.FUN_NAME_ERR, [fun_name])
            return
        }
        functions[fun_name] = fun_def
    }

    tryAddParam(parameters: Array<Parameter>, param: Parameter) {
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

    print_warning(warn_type: WarningType, args: string[]): void {
        this.error_handler.print_warning(this.lexer.get_reader(), this.lexer.token.pos, warn_type, args)
    }

    print_error(err_type: ErrorType, args: string[]): void {
        this.error_handler.print_error(this.lexer.get_reader(), this.lexer.token.pos, err_type, args)
        this.raised_error = true;
    }

    raise_critical_error(err_type: ErrorType, args: string[]): void {
        this.print_error(err_type, args);
        this.error_handler.abort(this.lexer.get_reader());
    }

    // print_error_no_code(err_type: ErrorType, args: string[]): void {
    //     this.error_handler.print_err_mess(ErrorUtils.error_mess[ErrorType.PATH_ERR]);
    //     this.raised_error = true;
    // }

    did_raise_error(): boolean {
        return this.raised_error;
    }

}