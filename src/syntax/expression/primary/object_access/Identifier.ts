import { Visitator } from "../../../../visitator/Visitator";
import { ObjectAccess } from "./ObjectAccess";

export class Identifier implements ObjectAccess {
    name: string;

    constructor(name: string) {
        this.name = name;
    }

    accept(visitator: Visitator) {
        visitator.visitIdentifier(this)
    }

}