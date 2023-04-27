export class Position {
	pos: number;
    line: number;
    col: number;

    constructor(pos?: number, line?: number, col?: number) {
        this.pos = (pos !== undefined) ? pos : 0;
        this.line = (line !== undefined) ? line : 1;
        this.col = (col !== undefined) ? col : 1;
    }
}
