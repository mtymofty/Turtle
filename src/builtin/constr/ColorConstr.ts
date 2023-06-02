import { Identifier } from "../../syntax/expression/primary/object_access/Identifier"
import { Visitor } from "../../visitor/Visitor"
import { Constructor } from "./Constructor"

export class ColorConstr implements Constructor {
    name: string = "Color"
    parameters: Array<Identifier> = [new Identifier("a", null),
                                    new Identifier("r", null),
                                    new Identifier("g", null),
                                    new Identifier("b", null)]

    param_types: Array<string> = ["integer",
                                "integer",
                                "integer",
                                "integer"]

    accept(visitor: Visitor) {
        visitor.visitColorConstr(this)
    }
}