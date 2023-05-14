import { Statement } from "./Statement";
import { Visitor } from "../../visitor/Visitor";

export class ReturnStatement implements Statement {

    accept(visitor: Visitor) {
        visitor.visitReturn(this)
    }
}
