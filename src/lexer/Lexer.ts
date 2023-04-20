import { ErrorHandler } from "../error/ErrorHandler";
import { Position } from "../source/Position";
import { Reader } from "../source/Reader";
import { Token } from "../token/Token";
import { TokenType } from "../token/TokenType";

export class Lexer {
    token: Token | null = null;
    curr_char: string | null = null;
    curr_pos: Position;
    curr_token_pos: Position | null = null;
    curr_line_beg: number;
    reader: Reader;

    error_handler: ErrorHandler;
    raised_error: boolean = false;

    newline: string | null = null
    newline_len: number = 0

    max_ident_len: number = 50;
    max_str_len: number = 300;

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
        if (this.try_build_eof() || this.try_build_operator() || this.try_build_terminator() || this.try_build_number()
            || this.try_build_id_kw() || this.skip_cmnt() || this.try_build_string()) {
            return this.token!;
        } else {
            this.print_error(`ERROR - UNRECOGNIZED TOKEN: "${this.curr_char}"`);

            this.next_char();
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

    print_error(err_mess: string) {
        if (!this.raised_error) {
            this.error_handler.print_error(err_mess, this.curr_line_beg, this.curr_token_pos!)
            this.raised_error = true;
        }

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
        if (this.curr_char!.length === 0) {
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
                this.print_error(`ERROR WHILE CREATING "${char!.concat(char!)}" OPERATOR\nEXPECTED "${char}" GOT "${this.curr_char}"`);
                return false;
            }
        }
    }

    try_build_terminator() {
        return false;
    }

    try_build_number() {
        return false;
    }

    try_build_id_kw() {
        return false;
    }

    skip_cmnt() {
        return false;
    }

    try_build_string() {
        return false;
    }
}