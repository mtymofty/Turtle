import { Statement } from "./Statement";
import { Visitor } from "../../visitor/Visitor";
import { Expression } from "../expression/Expression";
import { MemberAccess } from "../expression/primary/object_access/MemberAccess";
import { Identifier } from "../expression/primary/object_access/Identifier";

export class AssignStatement implements Statement {
    left: MemberAccess | Identifier;
    right: Expression;

    constructor(left: MemberAccess | Identifier, right: Expression) {
        this.left = left;
        this.right = right;
    }

    accept(visitor: Visitor) {
        visitor.visitAssignStatement(this)
    }
}
