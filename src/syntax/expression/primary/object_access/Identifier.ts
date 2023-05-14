import { Visitor } from "../../../../visitor/Visitor";
import { ObjectAccess } from "./ObjectAccess";

export class Identifier implements ObjectAccess {
    name: string;

    constructor(name: string) {
        this.name = name;
    }

    accept(visitor: Visitor) {
        visitor.visitIdentifier(this)
    }
}
