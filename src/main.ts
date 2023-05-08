import {FileReader, Reader, StringReader} from './source/Reader';
import { LexerImp } from './lexer/LexerImp';
import { Lexer } from './lexer/Lexer';
import { LexerFilter } from './lexer/LexerFilter';
import { Parser } from './parser/Parser';
import { Program } from './syntax/Program';
import { ErrorHandler } from './error/ErrorHandler';
import { FunctionDef } from './syntax/FunctionDef';
import { Parameter } from './syntax/Parameter';
import { PrinterVisitator } from './visitator/PrinterVisitator';



var file_path: string = process.argv.slice(2)[0];
var error_handler: ErrorHandler = new ErrorHandler()
var file_reader: Reader = new FileReader(file_path, error_handler)
var lexer: Lexer = new LexerFilter(new LexerImp(file_reader, error_handler));
var parser: Parser = new Parser(lexer, error_handler);
var program: Program = parser.parse()
var printer: PrinterVisitator = new PrinterVisitator();
console.log("\n")
program.accept(printer)

