import { Visitator } from "../../visitator/Visitator";
import { FunCall } from "./FunCall";
import { Identifier } from "./Identifier";
import { ObjectAccess } from "./ObjectAccess";

export class MemberAccess implements ObjectAccess {
    left: ObjectAccess;
    right: ObjectAccess;

    constructor(left: ObjectAccess, right: ObjectAccess) {
        this.left = left;
        this.right = right;
    }

    accept(visitator: Visitator) {
        visitator.visitMemberAccess(this)
    }

}