import { Reader } from "../source/Reader";
import { Token } from "../token/Token";

export interface Lexer {
    token: Token;
    next_token(): Token;
    did_raise_error(): boolean;
    get_reader(): Reader;
}
