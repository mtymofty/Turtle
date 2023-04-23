import * as fs from 'fs';
import { Position } from './Position';
import { ErrorHandler } from '../error/ErrorHandler';
import { ErrorType } from '../error/ErrorType';
import { ErrorUtils } from '../error/ErrorUtils';

export interface Reader {
	curr_pos: Position;
	get_char(): string;
	get_line(pos: number): string;
	abort(): void;
}

export class FileReader implements Reader {
	curr_pos: Position;
	private fd: number;
	private file_path: string;
	private error_handler: ErrorHandler;
	private newline_chars: string[] = ["\n", "\r"]

	constructor(path: string) {
		this.file_path = path;
		this.curr_pos = new Position();
		this.error_handler = new ErrorHandler(this);
		this.open();
	}

	get_char(): string {
		let buf = Buffer.alloc(1, 0);
		let read: number;

		read = fs.readSync(this.fd, buf, 0, 1, this.curr_pos.pos);
		if (read == 0){
			return "";
		}

		return buf.toString();
	}

	get_line(pos: number): string {
		let buf = Buffer.alloc(1, 0);
		var read: number;
		var line: string = ""

		read = fs.readSync(this.fd, buf, 0, 1, pos);
		while (!(this.newline_chars.includes(buf.toString())) && read != 0) {
			line = line.concat(buf.toString())
			pos += 1;
			read = fs.readSync(this.fd, buf, 0, 1, pos);
		}

		return line;
	}

	open(): void {
		try {
			this.fd = fs.openSync(this.file_path, "r");
		} catch(e) {
			this.error_handler.print_err_mess(ErrorUtils.error_mess[ErrorType.PATH_ERR]);
			process.exit(0);
		}
	}

	close(): void {
		if (this.fd) {
			fs.closeSync(this.fd);
		}
	}

	abort(): void {
		this.close();
	}
}

export class StringReader implements Reader {
	curr_pos: Position;
	private data: string;
	private len: number;
	private newline_chars: string[] = ["\n", "\r"]

	constructor(data: string) {
		this.data = data;
		this.len = data.length;
		this.curr_pos = new Position();
	}

	get_char(): string {
		if (this.len != this.curr_pos.pos) {
			let char: string = this.data[this.curr_pos.pos];
			return char;
		} else {
			return "";
		}
	}

	get_line(pos: number): string {
		var line: string = ""
		while (this.len != pos && !(this.data[pos] in this.newline_chars)) {
			line = line.concat(this.data[pos])
			pos += 1;
		}
		return line
	}

	abort(): void {}
}
