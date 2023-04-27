import { Position } from "../source/Position";
import { TokenType } from "./TokenType";

export class Token {
    type: TokenType;
    value: string | number;
    pos: Position

    constructor(type: TokenType, value: string | number, pos: Position) {
        this.type = type;
        this.value = value;
        this.pos = pos;
    }
}
