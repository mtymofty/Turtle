import { Visitator } from "../../../../visitator/Visitator";
import { Expression } from "../../Expression";

export class FalseConstant implements Expression {

    accept(visitator: Visitator) {
        visitator.visitFalseConstant(this)
    }

}