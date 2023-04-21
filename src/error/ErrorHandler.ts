import { Position } from "../source/Position";
import { Reader } from "../source/Reader";

export class ErrorHandler {
    reader: Reader;
	error_color: string;
    warning_color: string;
    code_color: string;
    white_color: string = "\x1B[0m";

    constructor(reader: Reader, error_col?: string, code_col?: string, warn_col?: string) {
        this.reader = reader;
        this.error_color = (error_col) ? error_col : "\x1B[31m";
        this.warning_color = (warn_col) ? warn_col : "\x1B[38;5;166m";
        this.code_color = (code_col) ? code_col : "\x1B[33m";
	}

    print_error(mess: string, line_beg: number, pos: Position){
        let code = this.reader.get_line(line_beg);

        console.log(this.error_color + mess);
        console.log(`line: ${pos.line} col: ${pos.col}`);
        console.log(this.code_color + code);
        console.log(' '.repeat(pos.pos-line_beg) + '^' + this.white_color);
    }

    print_warning(mess: string, line_beg: number, pos: Position){
        let code = this.reader.get_line(line_beg);

        console.log(this.warning_color + mess);
        console.log(`line: ${pos.line} col: ${pos.col}`);
        console.log(this.code_color + code);
        console.log(' '.repeat(pos.pos-line_beg) + '^' + this.white_color);
    }
}