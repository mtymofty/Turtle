import * as fs from 'fs';
import { Position } from './Position';

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

	constructor(path: string) {
		this.file_path = path;
		this.curr_pos = new Position();
		this.open();
	}

	get_char(): string {
		let buf = Buffer.alloc(1, 0);
		let read: number;

		read = fs.readSync(this.fd, buf, 0, 1, this.curr_pos.pos);
		if (read == 0){
			return "";
		}

		return JSON.stringify(buf.toString()).slice(1, -1);
	}

	get_line(pos: number): string {
		let buf = Buffer.alloc(1, 0);
		var read: number;

		var line: string = ""
		let newlines: string[] = ["\\n", "\\r"]

		read = fs.readSync(this.fd, buf, 0, 1, pos);
		while (!(newlines.includes(JSON.stringify(buf.toString()).slice(1, -1))) && read != 0) {
			line = line.concat(buf.toString())
			pos += 1;
			read = fs.readSync(this.fd, buf, 0, 1, pos);
		}

		return line;
	}

	open(): void {
		try {
			this.fd = fs.openSync(this.file_path, "r");
			console.log(this.fd);
		} catch(e) {
			console.log(e);
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

	constructor(data: string) {
		this.data = data;
		this.len = data.length;
		this.curr_pos = new Position();
	}

	get_char(): string {
		if (this.len != this.curr_pos.pos) {
			let char: string = this.data[this.curr_pos.pos];
			return JSON.stringify(char).slice(1, -1);
		} else {
			return "";
		}
	}

	get_line(pos: number): string {
		var line: string = ""
		let newlines: string[] = ["\\n", "\\r"]
		while (this.len != pos && !(this.data[pos] in newlines)) {
			line = line.concat(this.data[pos])
			pos += 1;
		}
		return line
	}

	abort(): void {}
}
