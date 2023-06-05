import { FileReader, Reader } from './source/Reader';
import { LexerImp } from './lexer/LexerImp';
import { Lexer } from './lexer/Lexer';
import { LexerFilter } from './lexer/LexerFilter';
import { ParserImp } from './parser/ParserImp';
import { Program } from './parser/syntax/Program';
import { Parser } from './parser/Parser';
import { InterpreterVisitor } from './interpreter/InterpreterVisitor';
import { createServer } from 'http';
import { Line } from './canvas/Line';


var file_path: string = process.argv.slice(2)[0];
var file_path: string = "code_snippets/text.txt"
var file_reader: Reader = new FileReader(file_path)

var lexer: Lexer = new LexerFilter(new LexerImp(file_reader));
var parser: Parser = new ParserImp(lexer);
var program: Program = parser.parse()


var interpreter = new InterpreterVisitor();
program.accept(interpreter)
file_reader.abort()

createServer(function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.writeHead(200, {'Content-Type': 'text/html'});
    const lines: Line[] = [
        {
            from: [0,0],
            to: [100,100],
            color:[255,0,255]
        },
        {
            from: [100,100],
            to: [100,200],
            color:[255,0,5]
        }
    ]

    const json = JSON.stringify(lines);
    res.end(json);
  }).listen(8080);
