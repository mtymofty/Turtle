import { Block } from "../syntax/Block";
import { BreakStatement } from "../syntax/statement/BreakStatement";
import { ContinueStatement } from "../syntax/statement/ContinueStatement";
import { FunctionDef } from "../syntax/FunctionDef";
import { Identifier } from "../syntax/expression/Identifier";
import { IfStatement } from "../syntax/statement/IfStatement";
import { Parameter } from "../syntax/Parameter";
import { Program } from "../syntax/Program";
import { ReturnStatement } from "../syntax/statement/ReturnStatement";
import { UnlessStatement } from "../syntax/statement/UnlessStatement";
import { WhileStatement } from "../syntax/statement/WhileStatement";
import { Visitable } from "./Visitable";
import { Constant } from "../syntax/expression/Constant";
import { ParenthExpression } from "../syntax/expression/ParenthExpression";
import { AssignStatement } from "../syntax/statement/AssignStatement";
import { FunCall } from "../syntax/expression/FunCall";
import { MemberAccess } from "../syntax/expression/MemberAccess";
import { Argument } from "../syntax/expression/Argument";

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
    visitConstant(node: Constant): void;
    visitParenthExpression(node: ParenthExpression): void;
    visitAssignStatement(node: AssignStatement): void;
    visitFunCall(node: FunCall): void;
    visitMemberAccess(node: MemberAccess): void;
    visitArgument(node: Argument): void;

}