import { FileReader, Reader } from './source/Reader';
import { LexerImp } from './lexer/LexerImp';
import { Lexer } from './lexer/Lexer';
import { LexerFilter } from './lexer/LexerFilter';
import { ParserImp } from './parser/ParserImp';
import { Program } from './parser/syntax/Program';
import { Parser } from './parser/Parser';
import { InterpreterVisitor } from './interpreter/InterpreterVisitor';
import { createServer } from 'http';


var file_path: string = process.argv.slice(2)[0];
var file_path: string = "code_snippets/text.txt"
var file_reader: Reader = new FileReader(file_path)

var lexer: Lexer = new LexerFilter(new LexerImp(file_reader));
var parser: Parser = new ParserImp(lexer);
var program: Program = parser.parse()

globalThis.lines = []
var interpreter = new InterpreterVisitor();
program.accept(interpreter)
file_reader.abort()

createServer(function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.writeHead(200, {'Content-Type': 'text/html'});

    const json = JSON.stringify(globalThis.lines);
    res.end(json);
  }).listen(8181);
