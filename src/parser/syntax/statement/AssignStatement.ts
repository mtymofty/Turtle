import { Statement } from "./Statement";
import { Visitor } from "../../../visitor/Visitor";
import { Expression } from "../expression/Expression";
import { MemberAccess } from "../expression/primary/object_access/MemberAccess";
import { Identifier } from "../expression/primary/object_access/Identifier";
import { Position } from "../../../source/Position";

export class AssignStatement implements Statement {
    left: MemberAccess | Identifier;
    right: Expression;
    position: Position;

    constructor(left: MemberAccess | Identifier, right: Expression, position: Position) {
        this.left = left;
        this.right = right;
        this.position = position
    }

    accept(visitor: Visitor) {
        visitor.visitAssignStatement(this)
    }
}
