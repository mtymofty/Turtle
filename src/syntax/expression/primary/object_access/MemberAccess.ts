import { Visitor } from "../../../../visitor/Visitor";
import { ObjectAccess } from "./ObjectAccess";

export class MemberAccess implements ObjectAccess {
    left: ObjectAccess;
    right: ObjectAccess;

    constructor(left: ObjectAccess, right: ObjectAccess) {
        this.left = left;
        this.right = right;
    }

    accept(visitor: Visitor) {
        visitor.visitMemberAccess(this)
    }
}
