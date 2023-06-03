import { Callable } from "../../semantics/Callable";
import { Position } from "../../../source/Position";
import { Block } from "../../../parser/syntax/Block";
import { Identifier } from "../../../parser/syntax/expression/primary/object_access/Identifier";
import { Visitor } from "../../../visitor/Visitor";

export class PrintFunction implements Callable {
    name: string = "print"
    parameters: Array<Identifier> = [new Identifier("printable", null)]

    accept(visitor: Visitor) {
        visitor.visitPrintFunction(this)
    }
}
