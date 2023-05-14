import { Visitator } from "../../../../visitator/Visitator";
import { Expression } from "../../Expression";

export class NullConstant implements Expression {

    accept(visitator: Visitator) {
        visitator.visitNullConstant(this)
    }

}