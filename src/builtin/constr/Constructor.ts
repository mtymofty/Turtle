import { Callable } from "../../semantics/Callable";

export interface Constructor extends Callable{
    param_types: Array<string>
}