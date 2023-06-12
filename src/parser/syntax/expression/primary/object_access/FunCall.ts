import { Position } from "../../../../../source/Position";
import { Visitor } from "../../../../../visitor/Visitor";
import { Expression } from "../../Expression";
import { ObjectAccess } from "./ObjectAccess";

export class FunCall implements ObjectAccess {
    fun_name: string;
    args: Array<Expression>
    position: Position;

    constructor(name: string, args: Array<Expression>, position: Position) {
        this.fun_name = name;
        this.args = args;
        this.position = position
    }

    accept(visitor: Visitor) {
        visitor.visitFunCall(this)
    }
}
