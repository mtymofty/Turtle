import { Value } from "../../semantics/Value";

export class FunCallContext {
    scopes: Array<Record<string, Value>> = []

    addScope() {
        this.scopes.push({})
    }

    remScope() {
        this.scopes.pop()
    }

    findVar(name: string) {
        for(var scope of Array.from(this.scopes).reverse()) {
            var val: Value = scope[name]
            if (val !== null && val !== undefined) {
                return val
            }
        }
        return undefined
    }

    storeVar(name: string, val: Value) {
        this.scopes[this.scopes.length-1][name] = val
    }
}