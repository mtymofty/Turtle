import { Value } from "../../semantics/Value";
import { FunCallContext } from "./FunCallContext";

export class Environment {
    context_stack: Array<FunCallContext> = []

    createFunCallContext() {
        var new_cont = new FunCallContext()
        new_cont.addScope()
        this.context_stack.push(new_cont)
    }

    deleteFunCallContext() {
        this.context_stack.pop()
    }

    createScope() {
        this.context_stack[this.context_stack.length-1].addScope()
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