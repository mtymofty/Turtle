import * as fs from 'fs';
import { Position } from './Position';
import { ErrorHandler } from '../error/ErrorHandler';
import { ErrorType } from '../error/ErrorType';
import { ErrorUtils } from '../error/ErrorUtils';

export interface Reader {
	curr_pos: Position;
	reader_pos: number;
	curr_line_beg: number;
	get_char(): string;
	peek(): string;
	get_line(pos: number): string;
	abort(): void;
}

export class FileReader implements Reader {
	curr_pos: Position;
	reader_pos: number;
	curr_line_beg: number = 0;
	private fd: number;
	private file_path: string;
	private newline_chars: string[] = ["\n", "\r"]

	constructor(path: string) {
		this.file_path = path;
		this.curr_pos = new Position();
		this.reader_pos = 0;
		this.open();
	}

	get_char(): string {
		var char = this.peek()
		if (char == '') {
			this.curr_pos.pos = this.reader_pos
			return char
		}
		this.curr_pos.pos = this.reader_pos
		this.reader_pos += (new TextEncoder().encode(char)).byteLength
		return char;
	}

	peek(): string {
		let buf = Buffer.alloc(8, 0, 'utf-8');
		let read: number;

		read = fs.readSync(this.fd, buf, 0, 8, this.reader_pos);

		var char = buf.toString()[0]
		if (read == 0){
			return "";
		}

		return char;
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
			ErrorHandler.print_err_mess(ErrorUtils.error_mess[ErrorType.PATH_ERR]);
			process.exit(0);
		}
	}

	close(): void {
		if (this.fd) {
			fs.closeSync(this.fd);
			this.fd = 0
		}
	}

	abort(): void {
		this.close();
	}
}

export class StringReader implements Reader {
	curr_pos: Position;
	reader_pos: number;
	curr_line_beg: number = 0;
	private data: string;
	private len: number;
	private newline_chars: string[] = ["\n", "\r"]

	constructor(data: string) {
		this.data = data;
		this.len = data.length;
		this.curr_pos = new Position();
		this.reader_pos = 0;
	}

	get_char(): string {
		var char = this.peek()
		if (this.len == this.reader_pos) {
			this.curr_pos.pos = this.reader_pos
			return char;
		}
		this.curr_pos.pos = this.reader_pos
		this.reader_pos += 1
		return char;
	}

	peek(): string {
		if (this.len != this.reader_pos) {
			let char: string = this.data[this.reader_pos];
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
