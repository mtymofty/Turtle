import { Visitable } from "../visitor/Visitable"
import { Visitor } from "../visitor/Visitor"

export class Parameter implements Visitable{
    name: string

    constructor(name: string) {
        this.name = name
    }

    accept(visitor: Visitor) {
        visitor.visitParam(this)
    }
}
