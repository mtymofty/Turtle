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

        var fun_block = this.parseBlock()

        if (fun_block == null) {
            this.raise_critical_error(ErrorType.FUN_BLOCK_ERR, [])
        }
        console.log("parseFunDef: blok")

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
                    console.log("parseParams(): nazwa parametru: " + param.name)
                    this.tryAddParam(parameters, param)
                }
                this.lexer.next_token()
            }
        }
        console.log("parseParams(): liczba parametrów: " + parameters.length)
        return parameters

    }

    parseParameter() {
        if (this.lexer.token.type !== TokenType.IDENTIFIER) {
            console.log("parseParameter(): koniec parametrów")
            return null
         }

         var param_name: string = this.lexer.token.value.toString()

         return new Parameter(param_name)

    }

    parseBlock() {
        if(!this.consumeIf(TokenType.L_C_BRACE_OP)) {
            console.log("parseBlock(): brak lewego curly brace")
            return null
        }
        console.log("parseBlock(): lewy curly brace")
        var statements = new Array<Statement>();
        var statement = this.parseStatement();
        while (statement != null) {
            console.log("parseBlock(): dodaje statement")
            statements.push(statement)
            var statement = this.parseStatement()
        }

        console.log("parseBlock(): liczba statementów: " + statements.length)

        if(!this.consumeIf(TokenType.R_C_BRACE_OP)) {
            console.log("parseBlock(): brak prawego curly brace")
            // non-crit error, expected right curly brace
        }
        console.log("parseBlock(): prawy curly brace")

        return new Block(statements)
    }

    parseStatement() {
        return this.parseIfStatement() || this.parseWhileStatement()
               || this.parseSimpleStatement()
    }

    parseLoopStatement() {
        return this.parseStatement() || this.parseBreakStatement() || this.parseContinueStatement()
    }

    parseSimpleStatement() {
        var statement: Statement = this.parseAssignOrFunctionCallStatement() || this.parseReturnStatement()

        if (statement == null){
            return null
        }

        if(!this.consumeIf(TokenType.TERMINATOR)) {
            console.log("parseSimpleStatement(): brak terminatora")
            // non-crit error, expected terminator
        }
        return statement;
    }

    parseIfStatement() {
        return null

    }

    parseWhileStatement() {
        return null

    }

    parseAssignOrFunctionCallStatement() {
        return null
    }

    parseReturnStatement() {
        if (this.lexer.token.type !== TokenType.RET_KW) {
            console.log("parseReturnStatement(): nie return")
            return null
        }
        this.lexer.next_token()
        return new ReturnStatement();
    }

    parseBreakStatement() {
        if (this.lexer.token.type !== TokenType.BREAK_KW) {
            console.log("parseBreakStatement(): nie break")
            return null
        }
        this.lexer.next_token()
        return new BreakStatement();
    }

    parseContinueStatement() {
        if (this.lexer.token.type !== TokenType.CONTINUE_KW) {
            console.log("parseContinueStatement(): nie continue")
            return null
        }
        this.lexer.next_token()
        return new ContinueStatement();
    }

    tryAddFunction(functions: Record<string, FunctionDef>, fun_name: string, fun_def: FunctionDef) {
        if (functions[fun_name] !== undefined) {
            console.log("tryAddFunction(): Zajęta nazwa funkcji " + fun_name)
            // non-crit error, zajęta nazwa funkcji
            return
        }
        console.log("tryAddFunction(): Dodaje nazwe " + fun_name)
        functions[fun_name] = fun_def
    }

    tryAddParam(parameters: Array<Parameter>, param: Parameter) {
        for(let parameter of parameters){
            if (parameter.name == param.name){
                console.log("tryAddParam(): Zajęta nazwa parametru " + param.name)
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