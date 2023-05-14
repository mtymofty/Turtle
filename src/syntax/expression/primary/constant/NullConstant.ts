import { Visitor } from "../../../../visitor/Visitor";
import { Expression } from "../../Expression";

export class NullConstant implements Expression {

    accept(visitor: Visitor) {
        visitor.visitNullConstant(this)
    }
}
