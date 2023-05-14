import { Visitor } from "../../../../visitor/Visitor";
import { Statement } from "../../../statement/Statement";
import { Argument } from "../../Argument";
import { ObjectAccess } from "./ObjectAccess";

export class FunCall implements ObjectAccess, Statement {
    fun_name: string;
    args: Array<Argument>

    constructor(name: string, args: Array<Argument>) {
        this.fun_name = name;
        this.args = args;
    }

    accept(visitor: Visitor) {
        visitor.visitFunCall(this)
    }
}
