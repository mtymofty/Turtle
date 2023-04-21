import {ReadStream} from 'fs';
import {FileReader, Reader, StringReader} from './source/Reader';
import {Position} from './source/Position';
import { Lexer } from './lexer/Lexer';
import { Token } from './token/Token';
import { TokenType } from './token/TokenType';
import XRegExp = require("xregexp")

var file_path: string = process.argv.slice(2)[0];
var reader: Reader = new FileReader(file_path);
var lexer = new Lexer(reader);

var i = 0;
var token: Token;
while(true) {
    token = lexer.next_token();
    if (token.type === TokenType.EMPTY) {
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