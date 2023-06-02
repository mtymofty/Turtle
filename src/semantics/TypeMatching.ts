import { Constructor } from "../builtin/constr/Constructor"
import { Color } from "../builtin/obj/Color"
import { ObjectInstance } from "../builtin/obj/ObjectInstance"
import { Pen } from "../builtin/obj/Pen"
import { Turtle } from "../builtin/obj/Turte"
import { TurtlePosition } from "../builtin/obj/TurtlePosition"
import { ErrorHandler } from "../error/ErrorHandler"
import { ErrorType } from "../error/ErrorType"
import { Position } from "../source/Position"

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

    static checkTypes(args, param_types, pos) {
        for (let i = 0; i < args.length-1; i++) {
            let arg_type = this.getTypeOf(args[i].value)
            if (arg_type !== param_types[i]) {

                this.raise_crit_err(ErrorType.OBJ_CONSTR_ERR, [param_types[i], arg_type], pos);
            }
          }
    }

    static isConstr(object: any): object is Constructor {
        return 'param_types' in object;
    }

    static raise_crit_err(err_type: ErrorType, args: string[], pos: Position): void {
        ErrorHandler.print_err_pos(pos, err_type, args)
        ErrorHandler.abort();
    }
}
