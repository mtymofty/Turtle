import { Visitor } from "../../../../visitor/Visitor";
import { Expression } from "../../Expression";
import { ObjectAccess } from "./ObjectAccess";

export class FunCall implements ObjectAccess {
    fun_name: string;
    args: Array<Expression>

    constructor(name: string, args: Array<Expression>) {
        this.fun_name = name;
        this.args = args;
    }

    accept(visitor: Visitor) {
        visitor.visitFunCall(this)
    }
}
