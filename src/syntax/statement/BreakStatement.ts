import { Statement } from "./Statement";
import { Visitor } from "../../visitor/Visitor";

export class BreakStatement implements Statement {

    accept(visitor: Visitor) {
        visitor.visitBreak(this)
    }
}
