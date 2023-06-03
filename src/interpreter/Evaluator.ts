import { ErrorHandler } from "../error/ErrorHandler"
import { ErrorType, WarningType } from "../error/ErrorType"
import { TypeMatching } from "./TypeMatching"
import { Position } from "../source/Position"

export class Evaluator {
    static evaluateAdd(left: any, right: any, pos: Position) {
        return Evaluator.checkOverflow(left + right, TypeMatching.numType(left, right), pos)
    }

    static evaluateSubtr(left: any, right: any, pos: Position) {
        return Evaluator.checkOverflow(left - right, TypeMatching.numType(left, right), pos)
    }

    static evaluateDiv(left: any, right: any, pos: Position) {
        if (right === 0) {
            ErrorHandler.raise_crit_err(ErrorType.ZERO_DIV_ERR, [], pos)
        }
        return Evaluator.checkOverflow(left / right, TypeMatching.numType(left, right), pos)
    }

    static evaluateIntDiv(left: any, right: any, pos: Position) {
        if (right === 0) {
            ErrorHandler.raise_crit_err(ErrorType.ZERO_DIV_ERR, [], pos)
        }
        return Evaluator.checkOverflow(Math.floor(left / right), TypeMatching.numType(left, right), pos)
    }

    static evaluateModulo(left: any, right: any, pos: Position) {
        return Evaluator.checkOverflow(left % right, TypeMatching.numType(left, right), pos)
    }

    static evaluateMult(left: any, right: any, pos: Position) {
        return Evaluator.checkOverflow(left * right, TypeMatching.numType(left, right), pos)
    }

    static evaluateExp(left: any, right: any, pos: Position) {
        return Evaluator.checkOverflow(left ** right, TypeMatching.numType(left, right), pos)
    }

    static evaluateAnd(left: any, right: any) {
        if(left) {
            if (right) {
                return true
            }
        }
        return false
    }

    static evaluateOr(left: any, right: any) {
        if (left) {
            return true
        } else if (right) {
            return true
        }
        return false
    }

    static evaluateNeg(val: any) {
        return -val
    }

    static evaluateLogNeg(val: any) {
        return !val
    }

    static evaluateEq(left: any, right: any) {
        return left == right
    }

    static evaluateNEq(left: any, right: any) {
        return left != right
    }

    static evaluateLEq(left: any, right: any) {
        return left <= right
    }

    static evaluateGEq(left: any, right: any) {
        return left >= right
    }

    static evaluateLess(left: any, right: any) {
        return left < right
    }

    static evaluateGrt(left: any, right: any) {
        return left > right
    }

    static checkOverflow(val: number, type: string, pos: Position) {
        if (val > Number.MAX_SAFE_INTEGER || val < Number.MIN_SAFE_INTEGER) {
            if(type == "integer") {
                val = Number.MAX_SAFE_INTEGER * Math.sign(val)
                ErrorHandler.print_warning_mess(WarningType.INT_OVERFLOW_WARN, [], pos)
            } else {
                val = Number.MAX_SAFE_INTEGER * Math.sign(val) + 0.0
                ErrorHandler.print_warning_mess(WarningType.DOUBLE_OVERFLOW_WARN, [], pos)
            }
        }
        return val

    }
}