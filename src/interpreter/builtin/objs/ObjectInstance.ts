import { Position } from "../../../source/Position";

export interface ObjectInstance{
    validateAttr(pos: Position): void
    attr: Record<string, any>
    methods: Record<string, [Function, Array<string>]>
}