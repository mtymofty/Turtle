import { Visitable } from "../visitator/Visitable";
import { Statement } from "./Statement";
import { Visitator } from "../visitator/Visitator";

export class BreakStatement implements Statement {

    accept(visitator: Visitator) {
        visitator.visitBreak(this)
    }

}