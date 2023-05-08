import { Visitable } from "../visitator/Visitable"
import { Visitator } from "../visitator/Visitator"

export class Parameter implements Visitable{
    name: string

    constructor(name: string) {
        this.name = name
    }

    accept(visitator: Visitator) {
        visitator.visitParam(this)
    }
}