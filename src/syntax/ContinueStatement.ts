import { Visitable } from "../visitator/Visitable";
import { Statement } from "./Statement";
import { Visitator } from "../visitator/Visitator";

export class ContinueStatement implements Statement {

    accept(visitator: Visitator) {
        visitator.visitContinue(this)
    }

}