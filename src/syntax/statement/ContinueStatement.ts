import { Statement } from "./Statement";
import { Visitor } from "../../visitor/Visitor";

export class ContinueStatement implements Statement {

    accept(visitor: Visitor) {
        visitor.visitContinue(this)
    }
}
