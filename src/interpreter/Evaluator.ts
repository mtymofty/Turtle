import { ErrorHandler } from "../error/ErrorHandler"
import { ErrorType } from "../error/ErrorType"
import { Position } from "../source/Position"

export class Evaluator {
    static evaluateAdd(left: any, right: any) {
        return left + right
    }

    static evaluateSubtr(left: any, right: any) {
        return left - right
    }

    static evaluateDiv(left: any, right: any, pos: Position) {
        if (right === 0) {
            ErrorHandler.raise_crit_err(ErrorType.ZERO_DIV_ERR, [], pos)
        }
        return left / right
    }

    static evaluateIntDiv(left: any, right: any, pos: Position) {
        if (right === 0) {
            ErrorHandler.raise_crit_err(ErrorType.ZERO_DIV_ERR, [], pos)
        }
        return Math.floor(left / right);
    }

    static evaluateModulo(left: any, right: any) {
        return left % right
    }

    static evaluateMult(left: any, right: any) {
        return left * right
    }

    static evaluateExp(left: any, right: any) {
        // TODO: HANDLE INFINITY
        return left ** right
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
}