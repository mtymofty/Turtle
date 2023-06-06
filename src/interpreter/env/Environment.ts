import { ErrorHandler } from "../../error/ErrorHandler";
import { ErrorType } from "../../error/ErrorType";
import { Position } from "../../source/Position";
import { Value } from "../semantics/Value";
import { FunCallContext } from "./FunCallContext";

export class Environment {
    context_stack: Array<FunCallContext> = []
    max_cont: number = 100;

    createFunCallContext(pos: Position) {
        if (this.context_stack.length >= this.max_cont) {
            ErrorHandler.raise_crit_err(ErrorType.RECUR_CONTEXT_ERR, [], pos)
        }
        var new_cont = new FunCallContext()
        new_cont.addScope(pos)
        this.context_stack.push(new_cont)
    }

    deleteFunCallContext() {
        this.context_stack.pop()
    }

    createScope(pos: Position) {
        this.context_stack[this.context_stack.length-1].addScope(pos)
    }

    deleteScope() {
        this.context_stack[this.context_stack.length-1].remScope()
    }

    find(name: string) {
        return this.context_stack[this.context_stack.length-1].findVar(name)
    }

    store(name: string, val: Value) {
        this.context_stack[this.context_stack.length-1].storeVar(name, val)
    }
}