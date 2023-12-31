import { Reader } from "../source/Reader";
import { Token } from "../token/Token";
import { TokenType } from "../token/TokenType";
import { Lexer } from "./Lexer";

export class LexerFilter implements Lexer {
    private lexer: Lexer;
    token: Token;

    constructor(lexer: Lexer) {
        this.lexer = lexer;
    }

    next_token(): Token {
        this.token = this.lexer.next_token()
        while (this.token.type == TokenType.COMMENT || this.token.type == TokenType.INVALID) {
            this.token = this.lexer.next_token()
        }
        return this.token;
    }

    get_reader(): Reader {
        return this.lexer.get_reader();
    }

    did_raise_error(): boolean {
        return this.lexer.did_raise_error();
    }

}
