import { Visitor } from "../../../../visitor/Visitor";
import { Expression } from "../../Expression";

export class BooleanConstant implements Expression {
    value: boolean;

    constructor(value: boolean) {
        this.value = value;
    }

    accept(visitor: Visitor) {
        visitor.visitTrueConstant(this)
    }
}
