import { Visitable } from "../../visitator/Visitable";
import { Visitator } from "../../visitator/Visitator";
import { Expression } from "./Expression";

export class Constant implements Expression {
    value: number | string | boolean;

    constructor(value: number | string | boolean) {
        this.value = value;
    }

    accept(visitator: Visitator) {
        visitator.visitConstant(this)
    }

}