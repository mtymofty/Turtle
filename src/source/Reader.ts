import * as fs from 'fs';

export interface Reader {
	get_char(pos: number): string;
	get_line(pos: number): string;
}

export class FileReader implements Reader {
	file_path: string;

	constructor(path: string) {
		this.file_path = path;
	}

	get_char(pos: number) {
		let buf = Buffer.alloc(1, 0);
		let fd: number | undefined;
		let read: number;

		try {
			fd = fs.openSync(this.file_path, "r");
			read = fs.readSync(fd, buf, 0, 1, pos);
		} finally {
			if (fd) {
				fs.closeSync(fd);
			}
		}
		if (read == 0){
			return "";
		}
		return JSON.stringify(buf.toString()).slice(1, -1);
	}

	get_line(pos: number) {
		let buf = Buffer.alloc(1, 0);
		let fd: number | undefined;
		var read: number;

		var line: string = ""
		let newlines: string[] = ["\\n", "\\r"]

		try {
			fd = fs.openSync(this.file_path, "r");
			read = fs.readSync(fd, buf, 0, 1, pos);
			while (!(newlines.includes(JSON.stringify(buf.toString()).slice(1, -1))) && read != 0) {
				line = line.concat(buf.toString())
				pos += 1;
				read = fs.readSync(fd, buf, 0, 1, pos);
			}

		} finally {
			if (fd) {
				fs.closeSync(fd);
			}
		}
		return line;
	}
}

export class StringReader implements Reader {
	data: string;
	len: number;

	constructor(data: string) {
		this.data = data;
		this.len = data.length;
	}

	get_char(pos: number) {
		if (this.len != pos) {
			let char = this.data[pos];
			return JSON.stringify(char).slice(1, -1);
		} else {
			return "";
		}
	}

	get_line(pos: number) {
		if (this.len != pos) {
			let char = this.data[pos];
			return JSON.stringify(char).slice(1, -1);
		} else {
			return "";
		}
	}
}