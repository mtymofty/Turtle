import { Visitor } from "./Visitor";

export interface Visitable {
    accept(visitator: Visitor)
}
