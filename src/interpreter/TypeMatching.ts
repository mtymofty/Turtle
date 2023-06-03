import { ObjectInstance } from "./builtin/objs/ObjectInstance"
import { ErrorHandler } from "../error/ErrorHandler"
import { ErrorType } from "../error/ErrorType"
import { Value } from "./semantics/Value"

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
    static matchesLog(_: any) {
        return true
    }

    static getTypeOf(val: any): string{
        if (val == null) {
            return "null"
        } else if (Number.isInteger(val)){
            return "integer"
        } else if (typeof(val) === "number") {
            return "double"
        } else if (val instanceof Object) {
            return val.constructor.name
        } else {
            return typeof(val)
        }
    }

    static checkTypes(args: Value[], param_types, pos) {
        if (args.length === 0) {
            return
        }
        var arg_types = args.map(arg => {
            return this.getTypeOf(arg.value)
        })
        for (let i = 0; i < args.length; i++) {
            // special case, when param type is a number, so it takes both integer and double (for example Turtle.angle)
            if (param_types[i] == "number" && (arg_types[i] == "integer" || arg_types[i] == "double")) {
                continue
            }
            if (arg_types[i] !== param_types[i]) {
                ErrorHandler.raise_crit_err(ErrorType.OBJ_CONSTR_ERR, [param_types.toString(), arg_types.toString()], pos);
            }
        }
    }

    static checkAssignType(arg, param_type, var_name, pos) {
        if (param_type == "number" && (this.getTypeOf(arg) == "integer" || this.getTypeOf(arg) == "double")) {
            return
        }
        if (this.getTypeOf(arg) !== param_type) {
            ErrorHandler.raise_crit_err(ErrorType.OBJ_ASSIGN_ERR, [param_type, var_name, this.getTypeOf(arg)], pos);
        }
    }

    static isObjectInstance(object: any){
        if (typeof(object) !== "object") {
            return false
        }
        return this.isObjectInstanceInt(object)
    }

    static isObjectInstanceInt(object: any): object is ObjectInstance {
        return 'validateAttr' in object;
    }

    static numType(left: number, right: number) {
        if (this.getTypeOf(left) == "double" || this.getTypeOf(right) == "double"){
            return "double"
        } else {
            return "integer"
        }
    }
}