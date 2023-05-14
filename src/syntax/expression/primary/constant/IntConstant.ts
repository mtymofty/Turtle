import { Visitor } from "../../../../visitor/Visitor";
import { Expression } from "../../Expression";

export class IntConstant implements Expression {
    value: number;

    constructor(value: number) {
        this.value = value;
    }

    accept(visitor: Visitor) {
        visitor.visitIntConstant(this)
    }
}
