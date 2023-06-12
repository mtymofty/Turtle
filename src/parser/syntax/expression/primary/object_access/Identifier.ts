import { Position } from "../../../../../source/Position";
import { Visitor } from "../../../../../visitor/Visitor";
import { ObjectAccess } from "./ObjectAccess";

export class Identifier implements ObjectAccess {
    name: string;
    position: Position;

    constructor(name: string, position: Position) {
        this.name = name;
        this.position = position
    }

    accept(visitor: Visitor) {
        visitor.visitIdentifier(this)
    }
}
