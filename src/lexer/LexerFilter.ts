import { Reader } from "../source/Reader";
import { Token } from "../token/Token";
import { TokenType } from "../token/TokenType";
import { Lexer } from "./Lexer";
import { LexerImp } from "./LexerImp";

export class LexerFilter implements Lexer {
    private lexer: LexerImp;
    private token: Token;

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
