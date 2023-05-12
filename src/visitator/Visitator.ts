import { Block } from "../syntax/Block";
import { BreakStatement } from "../syntax/BreakStatement";
import { ContinueStatement } from "../syntax/ContinueStatement";
import { FunctionDef } from "../syntax/FunctionDef";
import { Identifier } from "../syntax/Identifier";
import { IfStatement } from "../syntax/IfStatement";
import { Parameter } from "../syntax/Parameter";
import { Program } from "../syntax/Program";
import { ReturnStatement } from "../syntax/ReturnStatement";
import { UnlessStatement } from "../syntax/UnlessStatement";
import { WhileStatement } from "../syntax/WhileStatement";
import { Visitable } from "./Visitable";

export interface Visitator {
    indent: number
    visit(node: Visitable): void;
    visitProgram(node: Program): void;
    visitFunctionDef(node: FunctionDef): void;
    visitParam(node: Parameter): void;
    visitBlock(node: Block): void;
    visitIfStatement(node: IfStatement): void;
    visitUnlessStatement(node: UnlessStatement): void;
    visitWhileStatement(node: WhileStatement): void;
    visitReturn(node: ReturnStatement): void;
    visitBreak(node: BreakStatement): void;
    visitContinue(node: ContinueStatement): void;
    visitIdentifier(node: Identifier): void;

}