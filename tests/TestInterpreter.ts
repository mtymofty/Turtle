import { InterpreterVisitor } from "../src/interpreter/InterpreterVisitor";

export class TestInterpreter extends InterpreterVisitor {
    result() {
        return this.last_result
    }
}