import { InterpreterVisitor } from "../src/interpreter/InterpreterVisitor";

// Class made for testing, gives acces to result returned by the main function.
export class TestInterpreter extends InterpreterVisitor {
    result() {
        return this.last_result
    }

    calls() {
        return this.callables
    }
}