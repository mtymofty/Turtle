import {FileReader, Reader} from './source/Reader';
import { LexerImp } from './lexer/LexerImp';
import { Lexer } from './lexer/Lexer';
import { LexerFilter } from './lexer/LexerFilter';
import { ParserImp } from './parser/ParserImp';
import { Program } from './syntax/Program';
import { ErrorHandler } from './error/ErrorHandler';
import { PrinterVisitor } from './visitor/PrinterVisitor';
import { Parser } from './parser/Parser';


var file_path: string = process.argv.slice(2)[0];
var error_handler: ErrorHandler = new ErrorHandler()
var file_reader: Reader = new FileReader(file_path, error_handler)
var lexer: Lexer = new LexerFilter(new LexerImp(file_reader, error_handler));
var parser: Parser = new ParserImp(lexer, error_handler);

var program: Program = parser.parse()

var printer: PrinterVisitor = new PrinterVisitor();
program.accept(printer)
