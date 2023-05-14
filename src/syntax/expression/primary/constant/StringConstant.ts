import { Visitor } from "../../../../visitor/Visitor";
import { Expression } from "../../Expression";

export class StringConstant implements Expression {
    value: string;

    constructor(value: string) {
        this.value = value;
    }

    accept(visitor: Visitor) {
        visitor.visitStringConstant(this)
    }
}
