export class Evaluator {
    static evaluateAdd(left: any, right: any) {
        return left + right
    }

    static evaluateSubtr(left: any, right: any) {
        return left - right
    }

    static evaluateDiv(left: any, right: any) {
        return left / right
    }

    static evaluateIntDiv(left: any, right: any) {
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
        return left && right
    }

    static evaluateOr(left: any, right: any) {
        return left || right
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

    static evaluateGtr(left: any, right: any) {
        return left > right
    }



}