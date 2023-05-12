import { Visitable } from "../visitator/Visitable";
import { Visitator } from "../visitator/Visitator";
import { Expression } from "./Expression";

export class Identifier implements Expression {
    name: string;

    constructor(name: string) {
        this.name = name;
    }

    accept(visitator: Visitator) {
        visitator.visitIdentifier(this)
    }

}