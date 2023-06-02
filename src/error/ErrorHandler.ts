import { Position } from "../source/Position";
import { Reader } from "../source/Reader";
import { find_occurances, insert } from "../misc/String";
import { ErrorType, WarningType } from "./ErrorType";
import { ErrorUtils } from "./ErrorUtils";

export abstract class ErrorHandler {
	private static error_color: string = "\x1B[31m";
    private static warning_color: string = "\x1B[38;5;166m";
    private static code_color: string = "\x1B[33m";
    private static white_color: string = "\x1B[0m";

    static print_error(pos: Position, error_type: ErrorType, args: string[], reader?: Reader, ): void{
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

    static print_warning(pos: Position, warn_type: WarningType, args: string[], reader?: Reader, ){
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

    static print_err_mess(mess: string): void{
        console.log(this.error_color + mess);
    }

    static print_warn_mess(mess: string): void{
        console.log(this.warning_color + mess);
    }

    static print_code(code: string, pos: Position, line_beg: number):void {
        console.log(`line: ${pos.line} col: ${pos.col}`);
        console.log(this.code_color + code);
        console.log(' '.repeat(pos.pos-line_beg) + '^' + this.white_color);
    }

    static print_err_pos(pos: Position, error_type: ErrorType, args: string[], reader?: Reader, ): void{
        let mess = ErrorUtils.error_mess[error_type];

        var occurs: number[] = find_occurances("$", mess)
        if (args.length !== occurs.length) {
            this.raise_self_error(ErrorType[error_type], reader);
        }

        mess = this.insert_args(mess, args, occurs);

        this.print_err_mess(mess)
        this.print_pos(pos)
    }

    static print_warning_pos(pos: Position, warn_type: WarningType, args: string[], reader?: Reader, ){
        let mess = ErrorUtils.warning_mess[warn_type];

        var occurs: number[] = find_occurances("$", mess)
        if (args.length !== occurs.length) {
            this.raise_self_error(WarningType[warn_type], reader);
        }

        mess = this.insert_args(mess, args, occurs);

        this.print_warn_mess(mess)
        this.print_pos(pos)
    }

    static print_pos(pos: Position):void {
        console.log(`line: ${pos.line} col: ${pos.col} ${this.white_color}`);
    }

    static insert_args(mess: string, args: string[], occurs: number[]): string {
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

    static raise_self_error(alert_type: string, reader?: Reader): void {
        try {
            throw new Error(this.error_color + `Error/Warning string formatting doesn't match args number in ErrorHandler: ${alert_type}` + this.white_color);
          }
          catch(e) {
            console.log(e);
            this.abort(reader);
          }
    }

    static raise_crit_err(err_type: ErrorType, args: string[], pos: Position): void {
        this.print_err_pos(pos, err_type, args)
        this.abort();
    }

    static raise_crit_err_mess(err_type: ErrorType): void {
        this.print_err_mess(ErrorUtils.error_mess[err_type])
        this.abort();
    }

    static print_warning_mess(warn_type: WarningType, args: string[], pos: Position): void {
        this.print_warning_pos(pos, warn_type, args)
    }

    static abort(reader?: Reader): void {
        if (reader) {
            reader.abort();
        }
        process.exit(0);
    }
}
