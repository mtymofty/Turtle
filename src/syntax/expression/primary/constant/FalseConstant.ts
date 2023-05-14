import { Visitor } from "../../../../visitor/Visitor";
import { Expression } from "../../Expression";

export class FalseConstant implements Expression {

    accept(visitor: Visitor) {
        visitor.visitFalseConstant(this)
    }
}
