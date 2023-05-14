import { Visitator } from "../../../../visitator/Visitator";
import { Expression } from "../../Expression";

export class TrueConstant implements Expression {

    accept(visitator: Visitator) {
        visitator.visitTrueConstant(this)
    }

}