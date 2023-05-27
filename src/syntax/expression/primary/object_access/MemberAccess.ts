import { Position } from "../../../../source/Position";
import { Visitor } from "../../../../visitor/Visitor";
import { ObjectAccess } from "./ObjectAccess";

export class MemberAccess implements ObjectAccess {
    left: ObjectAccess;
    right: ObjectAccess;
    position: Position;

    constructor(left: ObjectAccess, right: ObjectAccess, position: Position) {
        this.left = left;
        this.right = right;
        this.position = position;
    }

    accept(visitor: Visitor) {
        visitor.visitMemberAccess(this)
    }
}
