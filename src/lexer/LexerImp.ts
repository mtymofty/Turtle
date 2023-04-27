import { ErrorHandler } from "../error/ErrorHandler";
import { Position } from "../source/Position";
import { Reader } from "../source/Reader";
import { Token } from "../token/Token";
import { TokenType } from "../token/TokenType";
import { TokenUtils } from "../token/TokenUtils";
import { is_letter, is_digit } from '../misc/Regex';
import { numeric_value } from "../misc/Math";
import { Lexer } from "./Lexer";
import { ErrorType, WarningType } from "../error/ErrorType";
import { printable } from "../misc/String";

export class LexerImp implements Lexer {
    private reader: Reader;
    private curr_char: string | null = null;

    private token: Token | null = null;
    private curr_token_pos: Position | null = null;

    private error_handler: ErrorHandler;
    private raised_error_now: boolean = false;
    private raised_error: boolean = false;

    private newline: string | null = null
    private curr_line_beg: number = 0

    private max_ident_len: number = 50;
    private max_str_len: number = 200;

    constructor(reader: Reader, max_ident_len?, max_str_len?) {
        this.max_ident_len = max_ident_len ? max_ident_len: 50
        this.max_str_len = max_str_len ?  max_str_len: 200
        this.reader = reader;
        this.error_handler = new ErrorHandler(reader);
        this.curr_char = this.reader.get_char()
        this.handle_eol()
    }

    next_token(): Token {
        this.raised_error_now = false;

        while(this.is_char_white()) {
                this.next_char();
        }

        this.curr_token_pos = new Position(this.reader.curr_pos.pos, this.reader.curr_pos.line, this.reader.curr_pos.col)
        if (this.try_build_eof() || this.try_build_operator() || this.try_build_number()
            || this.try_build_id_kw() || this.try_build_cmnt() || this.try_build_string()) {
            return this.token!;
        } else {
            if (!this.raised_error_now){
                this.print_error_pos(ErrorType.UNREC_TOKEN_ERR, [this.curr_char]);
                this.next_char();
            }
            return new Token(TokenType.INVALID, "", this.curr_token_pos)
        }

    }

    next_char(): void {
        if (this.curr_char == "\n") {
            this.reader.curr_pos.line += 1
            this.reader.curr_pos.col = 1
        } else if (this.is_char_eof()){
            return
        } else {
            this.reader.curr_pos.col += 1
        }

        this.curr_char = this.reader.get_char();
        this.handle_eol();
    }

    print_error_pos(err_type: ErrorType, args: string[]): void {
        this.error_handler.print_error(this.curr_pos(), this.curr_line_beg, err_type, args)
        this.raised_error_now = true;
        this.raised_error = true;
    }

    print_warning_pos(warn_type: WarningType, args: string[]): void {
        this.error_handler.print_warning(this.curr_pos(), this.curr_line_beg, warn_type, args)
    }

    print_error_token(err_type: ErrorType, args: string[]): void {
        this.error_handler.print_error(this.curr_token_pos, this.curr_line_beg, err_type, args)
        this.raised_error_now = true;
        this.raised_error = true;
    }

    raise_critical_error(err_type: ErrorType, args: string[]): void {
        this.print_error_pos(err_type, args);
        this.error_handler.abort();
    }

    is_char_white(): boolean {
        return (this.curr_char ===  " " || this.curr_char ===  "\t" || this.curr_char ===  "\n");
    }

    is_char_eol(char: string): boolean {
        if (char == "\n" || char == "\r") {
            return true;
        } else {
            return false;
        }
    }

    is_char_eof(): boolean {
        return this.curr_char!.length === 0
    }

    handle_eol(): void {
        if(!this.is_char_eol(this.curr_char) ){
            return
        }
        if (this.newline === null) {
            this.newline = this.curr_char;
            var char = this.reader.peek()

            if (this.is_char_eol(char) && char !== this.newline) {
                this.newline = this.newline!.concat(this.curr_char!);
                this.reader.get_char();
                this.curr_char = '\n'
            } else {
                this.curr_char = '\n'
            }

        } else if (this.curr_char == this.newline.substring(0, 1)){
            if (this.newline.length == 1) {
                this.curr_char = '\n'
            } else {
                var char = this.reader.peek()
                if (char == this.newline.substring(1, 2)){
                    this.reader.get_char();
                    this.curr_char = '\n'
                } else {
                    this.raise_critical_error(ErrorType.NEWLINE_ERR, [])
                }
            }
        } else {
            this.raise_critical_error(ErrorType.NEWLINE_ERR, [])
        }
    }

    try_build_eof(): boolean {
        if (this.is_char_eof()) {
            this.token = new Token(TokenType.EOF, "", this.curr_token_pos!);
            this.reader.abort();
            return true;
        }
        return false
    }

    try_build_operator(): boolean {
        var token_type = TokenUtils.simple_one_char_ops[this.curr_char!]
        if ( token_type!= null || token_type!= undefined) {
            this.token = new Token(token_type, "", this.curr_token_pos!);
            this.next_char();
            return true
        }

        var token_type = TokenUtils.extendable_one_char_ops[this.curr_char!]
        if (token_type!= null || token_type!= undefined) {
            var char = this.curr_char;
            this.next_char();
            var char_ext = char! + this.curr_char;
            var two_char_token_type = TokenUtils.extended_two_char_ops[char_ext]
            if (two_char_token_type!= null || two_char_token_type!= undefined) {
                this.token = new Token(two_char_token_type, "", this.curr_token_pos!);
                this.next_char();
            } else {
                this.token = new Token(token_type, "", this.curr_token_pos!);
            }
            return true;
        }

        var token_type = TokenUtils.double_char_ops[this.curr_char!.concat(this.curr_char!)]
        if (token_type != null || token_type != undefined) {
            var char = this.curr_char;
            this.next_char();
            if (char == this.curr_char) {
                this.token = new Token(token_type, "", this.curr_token_pos!);
                this.next_char();
                return true;
            } else {
                this.print_error_pos(ErrorType.OPERATOR_PARSE_ERR, [char!.concat(char!), char, printable(this.curr_char)]);
                return false;
            }
        }
    }

    try_build_number(): boolean {
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
                    this.print_error_token(ErrorType.INTEGER_EXC_VAL_ERR, []);
                    this.skip(value);
                    return true;
                }
            }
        } else {
            this.next_char();
            if (is_digit.test(this.curr_char)){
                this.print_error_token(ErrorType.NUM_PREC_ZERO_ERR, []);
                this.skip(value);
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
                    this.print_error_token(ErrorType.DOUBLE_EXC_VAL_ERR, []);
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

    private skip(value: number) {
        var found_dot = false;
        while (is_digit.test(this.curr_char) || (this.curr_char == "." && !found_dot)) {
            if (this.curr_char == ".") {
                found_dot = true;
            }
            this.next_char();
        }
        if (!found_dot) {

            this.token = new Token(TokenType.INTEGER, value = value, this.curr_token_pos);
        } else {
            this.token = new Token(TokenType.DOUBLE, value = value + 0.0, this.curr_token_pos);
        }
        return;
    }

    try_build_id_kw(): boolean {
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
                this.print_error_token(ErrorType.IDENT_LEN_ERR, []);
                this.token = new Token(TokenType.IDENTIFIER, ident, this.curr_token_pos);

                while(is_letter.test(this.curr_char) || this.curr_char == "_") {
                    this.next_char();
                }
                return true;
            }
        }
        if (ident in TokenUtils.keywords) {
            this.token = new Token(TokenUtils.keywords[ident], ident, this.curr_token_pos)
            return true;
        } else {
            this.token = new Token(TokenType.IDENTIFIER, ident, this.curr_token_pos)
            return true;
        }
    }

    try_build_cmnt(): boolean {
        if (this.curr_char != "#"){
            return false
        }
        var comment: string = "";
        this.next_char();
        // @ts-ignore
        while(this.curr_char != '\n' && !this.is_char_eof()) {
            comment = comment.concat(this.curr_char);
            this.next_char();
        }
        this.token = new Token(TokenType.COMMENT, comment, this.curr_token_pos)
        return true
    }

    try_build_string(): boolean {
        if (this.curr_char != '\"') {
            return false;
        }
        var string: string = "";
        this.next_char();
        while(this.curr_char != '\n' && !this.is_char_eof() && this.curr_char != '\"') {
            if (string.length != this.max_str_len) {
                if (this.curr_char == "\\") {
                    this.next_char();
                    if (this.curr_char in TokenUtils.escapable) {
                        this.curr_char = TokenUtils.escapable[this.curr_char]
                        // @ts-ignore
                    } else if (this.curr_char != '\n' || this.is_char_eof()){
                        break;
                    } else {
                        this.print_warning_pos(WarningType.STRING_ESC_WARN, [])
                    }
                }
                string = string.concat(this.curr_char)
                this.next_char();
            } else {
                this.print_error_token(ErrorType.STRING_LEN_ERR, []);

                while(this.curr_char != '\n' && !this.is_char_eof() && this.curr_char != '\"') {
                    this.next_char();
                }
                break;
            }
        }
        if (this.curr_char == '\"') {
            this.next_char();
        } else if (this.curr_char == '\n'){
            this.print_error_pos(ErrorType.STRING_EOL_ERR, []);
        } else if (this.is_char_eof()){
            this.print_error_pos(ErrorType.STRING_EOF_ERR, []);
        }

        this.token = new Token(TokenType.STRING, string, this.curr_token_pos);
        return true;
    }

    curr_pos(): Position {
        return this.reader.curr_pos;
    }

    did_raise_error(): boolean {
        return this.raised_error;
    }

    get_reader(): Reader {
        return this.reader;
    }

    skip_number() {
        var found_dot = false;
        while(is_digit.test(this.curr_char) || (this.curr_char == "." && !found_dot)) {
            if (this.curr_char == ".") {
                found_dot = true;
            }
            this.next_char();
        }
    }
}
