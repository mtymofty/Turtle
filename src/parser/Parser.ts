import { ErrorHandler } from "../error/ErrorHandler";
import { Lexer } from "../lexer/Lexer";
import { Block } from "../syntax/Block";
import { FunctionDef } from "../syntax/FunctionDef";
import { Parameter } from "../syntax/Parameter";
import { Program } from "../syntax/Program";
import { TokenType } from "../token/TokenType";
import { Statement } from "../syntax/Statement";
import { ReturnStatement } from "../syntax/ReturnStatement";

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
            console.log("parse(): Invalid token")
            // crit error, nielegalny token, wszystko musi być w funkcji
            // expected function def
        }
        return new Program(functions)
    }

    parseFunDef(functions: Record<string, FunctionDef>): boolean{
        if(!this.consumeIf(TokenType.FUN_KW)) {
            console.log("parseFunDef: Nie ma func")
            return false
        }

        if (this.lexer.token.type !== TokenType.IDENTIFIER) {
            console.log("parseFunDef: Mial byc identifier")
           // crit error, expected identifier
        }

        var fun_name: string = this.lexer.token.value.toString()
        this.lexer.next_token()
        console.log("parseFunDef: nazwa funkcji: " + fun_name)

        if(!this.consumeIf(TokenType.L_BRACE_OP)) {
            console.log("parseFunDef: expected left brace")
            // CRIT error, expected left brace
        }
        console.log("parseFunDef: left brace")

        var fun_params: Array<Parameter> = this.parseParams()
        console.log("parseFunDef: liczba parametrów: " + fun_params.length)


        if(!this.consumeIf(TokenType.R_BRACE_OP)) {
            console.log("parseFunDef: expected right brace")
            // NON-CRIT error, expected right brace
        }
        console.log("parseFunDef: right brace")

        var fun_block = this.parseBlock()

        if (fun_block === null) {
            console.log("parseFunDef: brak bloku")
            // CRIT error, expected block
        }
        console.log("parseFunDef: blok")

        this.tryAddFunction(functions, fun_name, new FunctionDef(fun_name, fun_params, fun_block))
        return true
    }

    parseParams() {
        var parameters = new Array<Parameter>();

        var param = this.parseParameter();
        console.log("parseParams(): nazwa parametru: " + param.name)
        if (param != null) {
            this.tryAddParam(parameters, param)

            while(this.consumeIf(TokenType.COMMA_OP)) {
                var param = this.parseParameter();
                if (param === null) {
                    //crit error, expected param
                }
                console.log("parseParams(): nazwa parametru: " + param.name)
                this.tryAddParam(parameters, param)
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
         this.lexer.next_token()
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
               || this.parseAssignOrFunctionCallStatement() ||  this.parseReturnStatement()
               || this.parseBreakStatement() ||  this.parseContinueStatement()

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
        return null

    }

    parseContinueStatement() {
        return null

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
                // non-crit error, zajęta nazwa parametru
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

    did_raise_error(): boolean {
        return this.raised_error;
    }
}