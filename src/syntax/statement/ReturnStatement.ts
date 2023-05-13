import { Visitable } from "../../visitator/Visitable";
import { Statement } from "./Statement";
import { Visitator } from "../../visitator/Visitator";

export class ReturnStatement implements Statement {

    accept(visitator: Visitator) {
        visitator.visitReturn(this)
    }

}