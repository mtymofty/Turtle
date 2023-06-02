import { Identifier } from "../../syntax/expression/primary/object_access/Identifier"
import { Visitor } from "../../visitor/Visitor"
import { Constructor } from "./Constructor"

export class TurtlePositionConstr implements Constructor {
    name: string = "TurtlePosition"
    parameters: Array<Identifier> = [new Identifier("x", null),
                                    new Identifier("y", null)]

    param_types: Array<string> = ["integer",
                                "integer"]

    accept(visitor: Visitor) {
        visitor.visitTurtlePositionConstr(this)
    }
}