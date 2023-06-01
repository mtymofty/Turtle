export class TypeMatching {
    // +, -, /, //, %, *, ^
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
}
