import { Visitor } from "../../../../visitor/Visitor";
import { Expression } from "../../Expression";

export class TrueConstant implements Expression {

    accept(visitor: Visitor) {
        visitor.visitTrueConstant(this)
    }
}
