import { ErrorHandler } from "../error/ErrorHandler";
import { Position } from "../source/Position";
import { Reader } from "../source/Reader";
import { Token } from "../token/Token";
import { TokenType } from "../token/TokenType";
import { is_letter, is_digit } from '../utils/Regex';
import { numeric_value } from "../utils/Math";

export class Lexer {
    token: Token | null = null;
    curr_char: string | null = null;
    curr_pos: Position;
    curr_token_pos: Position | null = null;
    curr_line_beg: number;
    reader: Reader;

    error_handler: ErrorHandler;
    raised_error: boolean = false;
    raised_error_ever: boolean = false;

    newline: string | null = null
    newline_len: number = 0

    max_ident_len: number = 50;
    max_str_len: number = 200;

    simple_one_char_ops: Record<string, TokenType> = {
        "+": TokenType.ADD_OP,
        "-": TokenType.MINUS_OP,
        "*": TokenType.MULT_OP,
        "^": TokenType.POW_OP,
        "%": TokenType.MOD_OP,
        ".": TokenType.DOT_OP,
        "(": TokenType.L_BRACE_OP,
        "{": TokenType.L_C_BRACE_OP,
        ")": TokenType.R_BRACE_OP,
        "}": TokenType.R_C_BRACE_OP,
        ",": TokenType.COMMA_OP,
        ";": TokenType.TERMINATOR
    }

    extendable_one_char_ops: Record<string, TokenType> = {
        "=": TokenType.ASSIGN_OP,
        "!": TokenType.NOT_OP,
        ">": TokenType.GRT_OP,
        "<": TokenType.LESS_OP,
        "/": TokenType.DIV_OP
    }

    extended_two_char_ops: Record<string, TokenType> = {
        "==": TokenType.EQ_OP,
        "!=": TokenType.NEQ_OP,
        ">=": TokenType.GRT_EQ_OP,
        "<=": TokenType.LESS_EQ_OP,
        "//": TokenType.DIV_INT_OP
    }

    double_char_ops: Record<string, TokenType> = {
        "&&": TokenType.AND_OP,
        "||": TokenType.OR_OP
    }

    keywords: Record<string, TokenType> = {
        "func": TokenType.FUN_KW,
        "return": TokenType.RET_KW,
        "while": TokenType.WHILE_KW,
        "break": TokenType.BREAK_KW,
        "continue": TokenType.CONTINUE_KW,
        "null": TokenType.NULL_KW,
        "if": TokenType.IF_KW,
        "else": TokenType.ELSE_KW,
        "unless": TokenType.UNLESS_KW,
        "true": TokenType.TRUE_KW,
        "false": TokenType.FALSE_KW
    }

    constructor(reader: Reader) {
        this.reader = reader;
        this.error_handler = new ErrorHandler(reader);
        this.curr_pos = new Position();
        this.next_char();
        this.curr_line_beg = 0;
    }

    next_token() {
        this.raised_error = false;

        while(this.is_char_white() || this.is_char_eol()) {
            if (this.is_char_white()){
                this.next_char();
            } else {
                this.handle_eol();
            }
        }

        this.curr_token_pos = new Position(this.curr_pos.pos, this.curr_pos.line, this.curr_pos.col)
        if (this.try_build_eof() || this.try_build_operator() || this.try_build_number()
            || this.try_build_id_kw() || this.skip_cmnt() || this.try_build_string()) {
            return this.token!;
        } else {
            if (!this.raised_error){
                this.print_error_pos(`ERROR - UNRECOGNIZED TOKEN: "${this.curr_char}"`);
                this.next_char();
            }
            return new Token(TokenType.EMPTY, "", this.curr_token_pos)
        }

    }

    next_char() {
        this.curr_pos.next_char();
        this.curr_char = this.reader.get_char(this.curr_pos.pos);
    }

    next_line() {
        this.curr_pos.next_line(this.newline_len);
        this.curr_line_beg = this.curr_pos.pos;
        this.curr_char = this.reader.get_char(this.curr_pos.pos);
    }

    print_error_pos(err_mess: string) {
        this.error_handler.print_error(err_mess, this.curr_line_beg, this.curr_pos!)
        this.raised_error = true;
        this.raised_error_ever = true;
    }

    print_error_token(err_mess: string) {
        this.error_handler.print_error(err_mess, this.curr_line_beg, this.curr_token_pos!)
        this.raised_error = true;
        this.raised_error_ever = true;
    }


    is_char_white() {
        return (this.curr_char ===  " ");
    }

    is_char_eol() {
        if (this.curr_char == "\\n" || this.curr_char == "\\r") {
            return true;
        } else {
            return false;
        }
    }

    is_char_eof() {
        return this.curr_char!.length === 0
    }

    handle_eol() {
        if (this.newline === null) {
            this.newline = this.curr_char;
            this.next_char();

            if (this.is_char_eol() && this.curr_char !== this.newline) {
                this.newline = this.newline!.concat(this.curr_char!);
                this.newline_len = 1;
                this.next_line();
                this.newline_len = 2;
            } else {
                this.next_line();
                this.newline_len = 1;
            }

        } else {
            this.next_line();
        }
    }

    try_build_eof() {
        if (this.is_char_eof()) {
            this.token = new Token(TokenType.EOF, "", this.curr_token_pos!);
            return true;
        }
        return false
    }

    try_build_operator() {
        if (this.curr_char! in this.simple_one_char_ops) {
            this.token = new Token(this.simple_one_char_ops[this.curr_char!], "", this.curr_token_pos!);
            this.next_char();
            return true
        } else if (this.curr_char! in this.extendable_one_char_ops) {
            var char = this.curr_char;
            this.next_char();
            var char_ext = char! + this.curr_char;
            if (char_ext in this.extended_two_char_ops) {
                this.token = new Token(this.extended_two_char_ops[char_ext], "", this.curr_token_pos!);
                this.next_char();
            } else {
                this.token = new Token(this.extendable_one_char_ops[char!], "", this.curr_token_pos!);
            }
            return true;
        } else if (this.curr_char!.concat(this.curr_char!) in this.double_char_ops) {
            var char = this.curr_char;
            this.next_char();
            if (char == this.curr_char) {
                this.token = new Token(this.double_char_ops[this.curr_char!.concat(this.curr_char!)], "", this.curr_token_pos!);
                this.next_char();
                return true;
            } else {
                this.print_error_pos(`ERROR WHILE PARSING "${char!.concat(char!)}" OPERATOR\nEXPECTED "${char}" GOT "${this.curr_char}"`);
                return false;
            }
        }
    }

    try_build_number() {
        if (!is_digit.test(this.curr_char)) {
            return false;
        }
        var value: number = numeric_value(this.curr_char);
        if (value != 0){
            this.next_char();
            while(is_digit.test(this.curr_char)) {
                var decimal = numeric_value(this.curr_char);
                if (((Number.MAX_SAFE_INTEGER - decimal) / 10 - value) >= 0) {
                    value = value * 10 + decimal;
                    this.next_char();
                } else {
                    // Skipping the rest of the number.
                    var found_dot = false;
                    while(is_digit.test(this.curr_char) || (this.curr_char == "." && !found_dot)) {
                        if (this.curr_char == ".") {
                            found_dot = true;
                        }
                        this.next_char();
                    }
                    if (!found_dot) {
                        this.print_error_token("ERROR - EXCEEDING VALUE OF A NUMERIC CONSTANT (INT)!");
                        this.token = new Token(TokenType.INTEGER, value=value, this.curr_token_pos);
                    } else {
                        this.print_error_token("ERROR - EXCEEDING VALUE OF A NUMERIC CONSTANT (DOUBLE)!");
                        this.token = new Token(TokenType.DOUBLE, value=value+0.0, this.curr_token_pos);
                    }
                    return true;
                }
            }
        } else {
            this.next_char();
            if (is_digit.test(this.curr_char)){
                this.print_error_token("ERROR - PRECEDING ZERO IN A NUMERIC CONSTANT!");


                var found_dot = false;
                    while(is_digit.test(this.curr_char) || (this.curr_char == "." && !found_dot)) {
                        if (this.curr_char == ".") {
                            found_dot = true;
                        }
                        this.next_char();
                    }

                    if (!found_dot) {
                        this.token = new Token(TokenType.INTEGER, value=value, this.curr_token_pos);
                    } else {
                        this.token = new Token(TokenType.DOUBLE, value=value+0.0, this.curr_token_pos);
                    }

                return true;
            }
        }
        if (this.curr_char == ".") {
            var fraction: number = 0;
            var num_of_decimals: number = 0;
            this.next_char();
            while(is_digit.test(this.curr_char)) {
                var decimal = numeric_value(this.curr_char);
                if (((Number.MAX_SAFE_INTEGER - decimal) / 10 - fraction) >= 0) {
                    fraction = fraction * 10 + decimal;
                    num_of_decimals += 1;
                } else {
                    // Skipping the rest of the number.
                    while(is_digit.test(this.curr_char)) {
                        this.next_char();
                    }
                    this.print_error_token("ERROR - EXCEEDING VALUE OF A NUMERIC CONSTANT (DOUBLE)!");
                    this.token = new Token(TokenType.DOUBLE, value=(value + fraction/Math.pow(10, num_of_decimals)), this.curr_token_pos);
                    return true;
                }
                this.next_char();
            }
            this.token = new Token(TokenType.DOUBLE, value=(value + fraction/Math.pow(10, num_of_decimals)), this.curr_token_pos);
            return true;
        } else {
            this.token = new Token(TokenType.INTEGER, value=value, this.curr_token_pos);
            return true;
        }
    }

    try_build_id_kw() {
        if (!is_letter.test(this.curr_char)) {
            return false;
        }
        var ident: string = this.curr_char;
        this.next_char();
        while(is_letter.test(this.curr_char) || this.curr_char == "_") {
            if (ident.length !== this.max_ident_len) {
                ident = ident.concat(this.curr_char)
                this.next_char();
            } else {
                this.print_error_token("ERROR - EXCEEDING LENGTH OF AN IDENTIFIER!");
                this.token = new Token(TokenType.IDENTIFIER, ident, this.curr_token_pos);

                while(is_letter.test(this.curr_char) || this.curr_char == "_") {
                    this.next_char();
                }
                return true;
            }
        }
        if (ident in this.keywords) {
            this.token = new Token(this.keywords[ident], ident, this.curr_token_pos)
            return true;
        } else {
            this.token = new Token(TokenType.IDENTIFIER, ident, this.curr_token_pos)
            return true;
        }
    }

    skip_cmnt() {
        if (this.curr_char == "#") {
            var comment: string = "";
            this.next_char();
            while(!this.is_char_eol() && !this.is_char_eof()) {
                comment = comment.concat(this.curr_char);
                this.next_char();
            }
            this.token = new Token(TokenType.COMMENT, comment, this.curr_token_pos)
            return true
        }
        return false
    }

    try_build_string() {
        return false;
    }
}