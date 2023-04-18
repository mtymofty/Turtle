export class Position {
	file_pos: number;
    line: number;
    col: number;

    public constructor(file_pos?: number, line?: number, col?: number) {
        this.file_pos = (file_pos) ? file_pos : 0;
        this.line = (line) ? line : 0;
        this.col = (col) ? col : 0;
	}

    next_char() {
        this.col += 1;
        this.file_pos += 1;
    }

    next_line() {
        this.line += 1;
        this.col = 0;
        this.file_pos += 1;
    }
}