import { Callable } from "../../semantics/Callable";
import { Identifier } from "../../../parser/syntax/expression/primary/object_access/Identifier";
import { Visitor } from "../../../visitor/Visitor";

export class Constructor implements Callable {
    name: string
    parameters: Array<Identifier>
    param_types: Array<string>
    obj_type

    constructor(name: string, parameters: Array<Identifier>, param_types: Array<string>, obj_type) {
        this.name = name
        this.parameters = parameters
        this.param_types = param_types
        this.obj_type = obj_type
    }

    accept(visitor: Visitor) {
        visitor.visitConstr(this)
    }
}