export class Position {
	pos: number;
    line: number;
    col: number;

    constructor(pos?: number, line?: number, col?: number) {
        this.pos = (pos !== undefined) ? pos : -1;
        this.line = (line !== undefined) ? line : 0;
        this.col = (col !== undefined) ? col : -1;
	}

    next_char() {
        this.col += 1;
        this.pos += 1;
    }

    next_line(pos_diff: number) {
        this.line += 1;
        this.col = 0;
        this.pos += pos_diff;
    }
}