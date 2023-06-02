import { Block } from "../syntax/Block";
import { BreakStatement } from "../syntax/statement/BreakStatement";
import { ContinueStatement } from "../syntax/statement/ContinueStatement";
import { FunctionDef } from "../syntax/FunctionDef";
import { Identifier } from "../syntax/expression/primary/object_access/Identifier";
import { IfStatement } from "../syntax/statement/IfStatement";
import { Program } from "../syntax/Program";
import { ReturnStatement } from "../syntax/statement/ReturnStatement";
import { UnlessStatement } from "../syntax/statement/UnlessStatement";
import { WhileStatement } from "../syntax/statement/WhileStatement";
import { AssignStatement } from "../syntax/statement/AssignStatement";
import { FunCall } from "../syntax/expression/primary/object_access/FunCall";
import { MemberAccess } from "../syntax/expression/primary/object_access/MemberAccess";
import { Addition } from "../syntax/expression/additive/Addition";
import { AndExpression } from "../syntax/expression/AndExpression";
import { Division } from "../syntax/expression/multiplicative/Division";
import { Multiplication } from "../syntax/expression/multiplicative/Multiplication";
import { Subtraction } from "../syntax/expression/additive/Subtraction";
import { Exponentiation } from "../syntax/expression/Exponentiation";
import { Negation } from "../syntax/expression/negation/Negation";
import { LogicalNegation } from "../syntax/expression/negation/LogicalNegation";
import { OrExpression } from "../syntax/expression/OrExpression";
import { IntDivision } from "../syntax/expression/multiplicative/IntDivision";
import { Modulo } from "../syntax/expression/multiplicative/Modulo";
import { GreaterComparison } from "../syntax/expression/comparison/GreaterComparison";
import { GreaterEqualComparison } from "../syntax/expression/comparison/GreaterEqualComparison";
import { LesserComparison } from "../syntax/expression/comparison/LesserComparison";
import { LesserEqualComparison } from "../syntax/expression/comparison/LesserEqualComparison";
import { EqualComparison } from "../syntax/expression/comparison/EqualComparison";
import { NotEqualComparison } from "../syntax/expression/comparison/NotEqualComparison";
import { BooleanConstant } from "../syntax/expression/primary/constant/BooleanConstant";
import { NullConstant } from "../syntax/expression/primary/constant/NullConstant";
import { StringConstant } from "../syntax/expression/primary/constant/StringConstant";
import { IntConstant } from "../syntax/expression/primary/constant/IntConstant";
import { DoubleConstant } from "../syntax/expression/primary/constant/DoubleConstant";
import { PrintFunction } from "../builtin/funs/PrintFunction";
import { ColorConstr } from "../builtin/constr/ColorConstr";
import { Constructor } from "../builtin/constr/Constructor";
import { PenConstr } from "../builtin/constr/PenConstr";
import { TurtleConstr } from "../builtin/constr/TurtleConstr";
import { TurtlePositionConstr } from "../builtin/constr/TurtlePositionConstr";

export interface Visitor {
    visitProgram(node: Program): void;
    visitFunctionDef(node: FunctionDef): void;
    visitBlock(node: Block): void;
    visitIfStatement(node: IfStatement): void;
    visitUnlessStatement(node: UnlessStatement): void;
    visitWhileStatement(node: WhileStatement): void;
    visitReturn(node: ReturnStatement): void;
    visitBreak(node: BreakStatement): void;
    visitContinue(node: ContinueStatement): void;
    visitIdentifier(node: Identifier): void;
    visitAssignStatement(node: AssignStatement): void;
    visitFunCall(node: FunCall): void;
    visitMemberAccess(node: MemberAccess): void;
    visitAddition(node: Addition): void;
    visitAndExpression(node: AndExpression): void;
    visitDivision(node: Division): void;
    visitMultiplication(node: Multiplication): void;
    visitSubtraction(node: Subtraction): void;
    visitExponentiation(node: Exponentiation): void;
    visitLogicalNegation(node: LogicalNegation): void;
    visitOrExpression(node: OrExpression): void;
    visitNegation(node: Negation): void;
    visitIntDivision(node: IntDivision): void;
    visitModulo(node: Modulo): void;
    visitGreaterComparison(node: GreaterComparison): void;
    visitGreaterEqualComparison(node: GreaterEqualComparison): void;
    visitLesserComparison(node: LesserComparison): void;
    visitLesserEqualComparison(node: LesserEqualComparison): void;
    visitEqualComparison(node: EqualComparison): void;
    visitNotEqualComparison(node: NotEqualComparison): void;
    visitBooleanConstant(node: BooleanConstant): void;
    visitNullConstant(node: NullConstant): void;
    visitStringConstant(node: StringConstant): void;
    visitIntConstant(node: IntConstant): void;
    visitDoubleConstant(node: DoubleConstant): void;

    visitPrintFunction(node: PrintFunction): void;
    visitColorConstr(node: ColorConstr): void;
    visitPenConstr(node: PenConstr): void;
    visitTurtleConstr(node: TurtleConstr): void;
    visitTurtlePositionConstr(node: TurtlePositionConstr): void;
}