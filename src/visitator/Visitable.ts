import { Visitator } from "./Visitator";

export interface Visitable {
    accept(visitator: Visitator)
}