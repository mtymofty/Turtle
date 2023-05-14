import { Visitator } from "../../../../visitator/Visitator";
import { Expression } from "../../Expression";

export class IntConstant implements Expression {
    value: number;

    constructor(value: number) {
        this.value = value;
    }

    accept(visitator: Visitator) {
        visitator.visitIntConstant(this)
    }

}