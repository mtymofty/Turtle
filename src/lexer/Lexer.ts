import { Position } from "../Position";
import { Reader } from "../Reader";

export class Lexer {
    token: string;
    curr_char: string;
    curr_pos: Position;
    curr_token_pos: Position;
    reader: Reader;

    newline: string | null = null
    newline_len: number = 0

    max_ident_len: number = 50;
    max_str_len: number = 300;

    constructor(reader: Reader) {
        this.reader = reader;
        this.curr_pos = new Position();
        this.next_char();
    }

    next_token() {
        while(this.is_white(this.curr_char) || this.is_eol(this.curr_char)) {
            if (this.is_white(this.curr_char)){
                this.next_char();
            } else {
                this.handle_eol();
            }
        }

        if (this.try_build_eof() || this.try_build_operator() || this.try_build_terminator() || this.try_build_number()
            || this.try_build_id_kw() || this.try_build_cmnt() || this.try_build_string()) {
            return this.token;
        }
    }

    next_char() {
        this.curr_pos.next_char();
        this.curr_char = this.reader.get_char(this.curr_pos.pos);
    }

    next_line() {
        this.curr_pos.next_line(this.newline_len);
        this.curr_char = this.reader.get_char(this.curr_pos.pos);
    }

    is_white(char: string) {
        return (char ===  " ");
    }

    is_eol(char: string) {
        if (char === "\n" || char === "\r") {
            return true;
        } else {
            return false;
        }
    }

    handle_eol() {
        if (this.newline === null) {
            this.newline = this.curr_char;
            this.newline_len = 1;
            this.next_char();

            if (this.is_eol(this.curr_char) && this.curr_char !== this.newline) {
                this.next_line();
                this.newline_len = 2;
            }

        } else {
            this.next_line();
        }
    }

    try_build_eof() {
        if (this.curr_char.length === 0) {
            this.token = "EOF";
            this.curr_token_pos = this.curr_pos;
            return true;
        }
        return false
    }

    try_build_operator() {
        return false;
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

    try_build_cmnt() {
        return false;
    }

    try_build_string() {
        return false;
    }
}