import { Identifier } from "../../syntax/expression/primary/object_access/Identifier"
import { Visitor } from "../../visitor/Visitor"
import { Constructor } from "./Constructor"

export class PenConstr implements Constructor {
    name: string = "Pen"
    parameters: Array<Identifier> = [new Identifier("enabled", null),
                                    new Identifier("color", null)]

    param_types: Array<string> = ["boolean",
                                "Color"]

    accept(visitor: Visitor) {
        visitor.visitPenConstr(this)
    }
}