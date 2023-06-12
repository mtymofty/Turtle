import { FileReader, Reader } from './source/Reader';
import { LexerImp } from './lexer/LexerImp';
import { Lexer } from './lexer/Lexer';
import { LexerFilter } from './lexer/LexerFilter';
import { ParserImp } from './parser/ParserImp';
import { Program } from './parser/syntax/Program';
import { PrinterVisitor } from './visitor/PrinterVisitor';
import { Parser } from './parser/Parser';
import { InterpreterVisitor } from './interpreter/InterpreterVisitor';
import { writeFileSync } from 'fs';
import { Lines } from './interpreter/semantics/lines/Lines';


var file_path: string = process.argv.slice(2)[0];
var file_reader: Reader = new FileReader(file_path)
var lexer: Lexer = new LexerFilter(new LexerImp(file_reader));
var parser: Parser = new ParserImp(lexer);

var program: Program = parser.parse()

var printer: PrinterVisitor = new PrinterVisitor();
program.accept(printer)

console.log("\n>>EXECUTING PROGRAM<<\n")
var interpreter = new InterpreterVisitor();
program.accept(interpreter)
file_reader.abort()

writeFileSync('canvas/src/lines.json', JSON.stringify(Lines.lines));
