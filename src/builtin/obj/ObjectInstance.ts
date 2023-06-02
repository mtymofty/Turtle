import { Position } from "../../source/Position";

export interface ObjectInstance{
    validateAttr(pos: Position): void
    attr: Record<string, Function>
    methods: Record<string, Function>
}