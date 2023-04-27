import {FileReader, Reader, StringReader} from './source/Reader';
import { LexerImp } from './lexer/LexerImp';
import { Token } from './token/Token';
import { TokenType } from './token/TokenType';
import { Lexer } from './lexer/Lexer';
import { LexerFilter } from './lexer/LexerFilter';


function get_all_tokens(file_path: string): Token[] {
    var lexer: Lexer = new LexerImp(new StringReader("\n\r"));

    var i = 0;
    var tokens: Token[] = []
    var token: Token;
    while(true) {
        token = lexer.next_token();
        print_token_info(token);
        tokens.push(token)
        if (token.type === TokenType.EOF) {
            break;
        }
        i += 1;
    }
    return tokens
}

function print_token_info(token: Token): void {
    console.log(`TOKEN: ${TokenType[token.type]}`);
    console.log(`VALUE: ${token.value}`);
    console.log(`line: ${token.pos.line} col: ${token.pos.col} pos: ${token.pos.pos}\n`);

}

var file_path: string = process.argv.slice(2)[0];
var tokens: Token[] = get_all_tokens(file_path);

var token_types = tokens.map((token)=> {
    return `\n${TokenType[token.type]}`;
})

console.log(`Wykryto ${tokens.length} tokeny/ów.`)
console.log(`Lista tokenów: ${token_types}.`)
