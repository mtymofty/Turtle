import { Position } from "../source/Position";
import { Reader } from "../source/Reader";
import { find_occurances, insert } from "../misc/String";
import { ErrorType, WarningType } from "./ErrorType";
import { ErrorUtils } from "./ErrorUtils";

export class ErrorHandler {
	private error_color: string;
    private warning_color: string;
    private code_color: string;
    private white_color: string = "\x1B[0m";

    constructor(error_col?: string, code_col?: string, warn_col?: string) {
        this.error_color = (error_col) ? error_col : "\x1B[31m";
        this.warning_color = (warn_col) ? warn_col : "\x1B[38;5;166m";
        this.code_color = (code_col) ? code_col : "\x1B[33m";
	}

    print_error(reader: Reader, pos: Position, error_type: ErrorType, args: string[]): void{
        let code = reader.get_line(reader.curr_line_beg);
        let mess = ErrorUtils.error_mess[error_type];

        var occurs: number[] = find_occurances("$", mess)
        if (args.length !== occurs.length) {
            this.raise_self_error(ErrorType[error_type], reader);
        }

        mess = this.insert_args(mess, args, occurs);

        this.print_err_mess(mess)
        this.print_code(code, pos, reader.curr_line_beg)
    }

    print_warning(reader: Reader, pos: Position, warn_type: WarningType, args: string[]){
        let code = reader.get_line(reader.curr_line_beg);
        let mess = ErrorUtils.warning_mess[warn_type];

        var occurs: number[] = find_occurances("$", mess)
        if (args.length !== occurs.length) {
            this.raise_self_error(WarningType[warn_type], reader);
        }

        mess = this.insert_args(mess, args, occurs);

        this.print_warn_mess(mess)
        this.print_code(code, pos, reader.curr_line_beg)
    }

    print_err_mess(mess: string): void{
        console.log(this.error_color + mess);
    }

    print_warn_mess(mess: string): void{
        console.log(this.warning_color + mess);
    }

    print_code(code: string, pos: Position, line_beg: number):void {
        console.log(`line: ${pos.line} col: ${pos.col}`);
        console.log(this.code_color + code);
        console.log(' '.repeat(pos.pos-line_beg) + '^' + this.white_color);
    }

    insert_args(mess: string, args: string[], occurs: number[]): string {
        var i = 0;
        if (occurs.length) {
            var diff = 0;
            occurs.forEach( (occur) => {

                if (i!=0) {
                    diff += args[i-1].length-1;
                }
                var idx = occur+diff;
                mess = insert(mess, idx, args[i])
                i += 1;
            });
        }
        return mess;
    }

    raise_self_error(alert_type: string, reader: Reader): void {
        try {
            throw new Error(this.error_color + `Error/Warning string formatting doesn't match args number in ErrorHandler: ${alert_type}` + this.white_color);
          }
          catch(e) {
            console.log(e);
            this.abort(reader);
          }
    }

    abort(reader: Reader): void {
        reader.abort();
        process.exit(0);
    }
}
