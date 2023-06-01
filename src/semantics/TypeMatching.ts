export class TypeMatching {
    // +
    static matchesAdd(left: any, right: any) {
        if (typeof(left) === "number" ) {
            if (typeof(right) === "number") {
                return true
            }
        } else if (typeof(left) === "string") {
            if (typeof(right) === "string") {
                return true
            }
        }
        return false
    }

    // -, /, //, %, *, ^
    static matchesArithm(left: any, right: any) {
        if (typeof(left) === "number") {
            if (typeof(right) === "number") {
                return true
            }
        }
        return false
    }

    // !=, ==
    static matchesEq(left: any, right: any) {
        if (typeof(left) === typeof(right)) {
            return true
        } else if (left === null || right === null) {
            return true
        }
        return false
    }

    // >, >=, <, <=
    static matchesComp(left: any, right: any) {
        if (typeof(left) === typeof(right)) {
            return true
        } else if (left === null || right === null) {
            return true
        }
        return false
    }

    // -
    static matchesNeg(val: any) {
        if (typeof(val) === "number") {
            return true
        }
        return false
    }

    // !
    static matchesLogNeg(val: any) {
        if (typeof(val) === "boolean") {
            return true
        }
        return false
    }

    // &&, || dla dowolnych typów

    static getTypeOf(val: any){
        if (val == null) {
            return "null"
        } else if (Number.isInteger(val)){
            return "integer"
        } else if (typeof(val) === "number") {
            return "double"
        } else {
            return typeof(val)
        }
    }
}
