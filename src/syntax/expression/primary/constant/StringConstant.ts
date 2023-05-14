import { Visitator } from "../../../../visitator/Visitator";
import { Expression } from "../../Expression";

export class StringConstant implements Expression {
    value: string;

    constructor(value: string) {
        this.value = value;
    }

    accept(visitator: Visitator) {
        visitator.visitStringConstant(this)
    }

}