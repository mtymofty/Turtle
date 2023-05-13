import { Program } from "../syntax/Program";

export interface Parser {
    parse(): Program
    did_raise_error(): boolean
}