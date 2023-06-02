import { Identifier } from "../../syntax/expression/primary/object_access/Identifier"
import { Visitor } from "../../visitor/Visitor"
import { Constructor } from "./Constructor"

export class TurtleConstr implements Constructor {
    name: string = "Turtle"
    parameters: Array<Identifier> = [new Identifier("pen", null),
                                    new Identifier("position", null),
                                    new Identifier("angle", null)]

    param_types: Array<string> = ["Pen",
                                "TurtlePosition",
                                "integer",]
    accept(visitor: Visitor) {
        visitor.visitTurtleConstr(this)
    }
}