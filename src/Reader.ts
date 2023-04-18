import * as fs from 'fs';

export interface Reader {
	get_char(): string | null;
}

export class FileReader implements Reader {
	file_position: number;
	file_path: string;

	constructor(path: string) {
		this.file_path = path;
		this.file_position = 0;
	}

	get_char() {
		let buf = Buffer.alloc(1, 0);
		let fd: number | undefined;
		let read: number;

		try {
			fd = fs.openSync(this.file_path, "r");
			read = fs.readSync(fd, buf, 0, 1, this.file_position);
		} finally {
			if (fd) {
				fs.closeSync(fd);
			}
		}
		this.file_position += 1;
		if (read == 0){
			return null;
		}
		return JSON.stringify(buf.toString()).slice(1, -1);
	}
}

export class StringReader implements Reader {
	position: number;
	data: string;
	len: number;

	constructor(data: string) {
		this.position = 0;
		this.data = data;
		this.len = data.length;
	}

	get_char() {
		if (this.len != this.position) {
			let char = this.data[this.position];
			this.position += 1;
			return JSON.stringify(char).slice(1, -1);
		} else {
			return null;
		}
	}
}