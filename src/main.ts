import {FileReader, Reader, StringReader} from './source/Reader';
import { LexerImp } from './lexer/LexerImp';
import { Token } from './token/Token';
import { TokenType } from './token/TokenType';
import { Lexer } from './lexer/Lexer';

var file_path: string = process.argv.slice(2)[0];
var reader: Reader = new FileReader(file_path);
var lexer: Lexer = new LexerImp(reader);

var i = 0;
var token: Token;
while(true) {
    token = lexer.next_token();
    if (token.type === TokenType.INVALID) {
        continue;
    } else {
        console.log(`TOKEN: ${TokenType[token.type]}`);
        console.log(`line: ${token.pos.line} col: ${token.pos.col} pos: ${token.pos.pos}\n`);
        console.log(`VALUE: ${token.value}\n`);
    }
    if (token.type === TokenType.EOF) {
        break;
    }
    i += 1;
}
