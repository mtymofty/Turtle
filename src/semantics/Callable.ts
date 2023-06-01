import { Identifier } from "../syntax/expression/primary/object_access/Identifier"
import { Visitable } from "../visitor/Visitable"

export interface Callable extends Visitable{
    name: string
    parameters: Array<Identifier>
}