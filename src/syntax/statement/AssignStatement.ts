import { Statement } from "./Statement";
import { Visitator } from "../../visitator/Visitator";
import { Expression } from "../expression/Expression";
import { MemberAccess } from "../expression/MemberAccess";
import { Identifier } from "../expression/Identifier";

export class AssignStatement implements Statement {
    left: MemberAccess | Identifier;
    right: Expression;

    constructor(left: MemberAccess | Identifier, right: Expression) {
        this.left = left;
        this.right = right;
    }

    accept(visitator: Visitator) {
        visitator.visitAssignStatement(this)
    }

}