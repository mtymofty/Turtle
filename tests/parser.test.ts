import { LexerImp } from '../src/lexer/LexerImp';
import { ParserImp } from '../src/parser/ParserImp';
import { StringReader } from '../src/source/Reader';
import { AndExpression } from '../src/parser/syntax/expression/AndExpression';
import { Exponentiation } from '../src/parser/syntax/expression/Exponentiation';
import { OrExpression } from '../src/parser/syntax/expression/OrExpression';
import { Addition } from '../src/parser/syntax/expression/additive/Addition';
import { Subtraction } from '../src/parser/syntax/expression/additive/Subtraction';
import { EqualComparison } from '../src/parser/syntax/expression/comparison/EqualComparison';
import { GreaterComparison } from '../src/parser/syntax/expression/comparison/GreaterComparison';
import { GreaterEqualComparison } from '../src/parser/syntax/expression/comparison/GreaterEqualComparison';
import { LesserComparison } from '../src/parser/syntax/expression/comparison/LesserComparison';
import { LesserEqualComparison } from '../src/parser/syntax/expression/comparison/LesserEqualComparison';
import { NotEqualComparison } from '../src/parser/syntax/expression/comparison/NotEqualComparison';
import { Division } from '../src/parser/syntax/expression/multiplicative/Division';
import { IntDivision } from '../src/parser/syntax/expression/multiplicative/IntDivision';
import { Modulo } from '../src/parser/syntax/expression/multiplicative/Modulo';
import { Multiplication } from '../src/parser/syntax/expression/multiplicative/Multiplication';
import { LogicalNegation } from '../src/parser/syntax/expression/negation/LogicalNegation';
import { Negation } from '../src/parser/syntax/expression/negation/Negation';
import { FunCall } from '../src/parser/syntax/expression/primary/object_access/FunCall';
import { Identifier } from '../src/parser/syntax/expression/primary/object_access/Identifier';
import { MemberAccess } from '../src/parser/syntax/expression/primary/object_access/MemberAccess';
import { AssignStatement } from '../src/parser/syntax/statement/AssignStatement';
import { IfStatement } from '../src/parser/syntax/statement/IfStatement';
import { WhileStatement } from '../src/parser/syntax/statement/WhileStatement';
import { IntConstant } from '../src/parser/syntax/expression/primary/constant/IntConstant';
import { DoubleConstant } from '../src/parser/syntax/expression/primary/constant/DoubleConstant';
import { BooleanConstant } from '../src/parser/syntax/expression/primary/constant/BooleanConstant';
import { NullConstant } from '../src/parser/syntax/expression/primary/constant/NullConstant';
import { StringConstant } from '../src/parser/syntax/expression/primary/constant/StringConstant';

const mock_exit = jest.spyOn(process, 'exit')
            .mockImplementation((number) => { throw new Error('process.exit: ' + number); });


beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

describe('Parser class integration tests:', () => {
  test('1. Empty string should return program with zero functions', () => {
    var lexer = new LexerImp(new StringReader(""))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()
    expect(Object.keys(program.functions).length).toBe(0);
  });

  test('2. Non-FunctionDef token should raise an error', () => {
    var lexer = new LexerImp(new StringReader("x=5"))
    var parser: ParserImp = new ParserImp(lexer);

    const parse = () => {
        parser.parse()
    };

    expect(parse).toThrow();
    expect(mock_exit).toHaveBeenCalledWith(0);
  });

  test('3. String with function definition should return program with 1 function', () => {
    var lexer = new LexerImp(new StringReader("func fun() {}"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()
    expect(Object.keys(program.functions).length).toBe(1);
  });

  test('4. String with multiple function definitions with the same name should return program with 1 functions', () => {
    var lexer = new LexerImp(new StringReader("func fun() {} \n func fun() {}"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()
    expect(Object.keys(program.functions).length).toBe(1);
  });

  test('5. String with multiple function definitions should return program with multiple functions', () => {
    var lexer = new LexerImp(new StringReader("func fun() {} \n func fun2() {}"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()
    expect(Object.keys(program.functions).length).toBe(2);
  });

  test('6. Function should have correct identifier name', () => {
    var lexer = new LexerImp(new StringReader("func fun() {}"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()
    expect(program.functions['fun']).not.toBe(undefined);
    expect(program.functions['fun'].name).toBe('fun');
  });

  test('7. Missing identifier should raise an error', () => {
    var lexer = new LexerImp(new StringReader("func () {}"))
    var parser: ParserImp = new ParserImp(lexer);

    const parse = () => {
        parser.parse()
    };

    expect(parse).toThrow();
    expect(mock_exit).toHaveBeenCalledWith(0);
  });

  test('8. Missing left bracket in params list should raise non-crit error', () => {
    var lexer = new LexerImp(new StringReader("func fun param) {}"))
    var parser: ParserImp = new ParserImp(lexer);
    parser.parse()
    expect(parser.did_raise_error()).toBe(true);
  });

  test('9. Missing right bracket in params list should raise non-crit error', () => {
    var lexer = new LexerImp(new StringReader("func fun (param {}"))
    var parser: ParserImp = new ParserImp(lexer);
    parser.parse()
    expect(parser.did_raise_error()).toBe(true);
  });

  test('10. Function with one param should store correct param data', () => {
    var lexer = new LexerImp(new StringReader("func fun(param) {}"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()
    expect(program.functions['fun'].parameters.length).toBe(1);
    expect(program.functions['fun'].parameters[0].name).toBe('param');
  });

  test('11. Function with multiple params should store correct params data', () => {
    var lexer = new LexerImp(new StringReader("func fun(param, param2) {}"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()
    expect(program.functions['fun'].parameters.length).toBe(2);
    expect(program.functions['fun'].parameters[0].name).toBe('param');
    expect(program.functions['fun'].parameters[1].name).toBe('param2');
  });

  test('12. Trailing comma in params list should raise non-crit error', () => {
    var lexer = new LexerImp(new StringReader("func fun(param, ) {}"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()
    expect(program.functions['fun'].parameters.length).toBe(1);
    expect(program.functions['fun'].parameters[0].name).toBe('param');
    expect(parser.did_raise_error()).toBe(true);
  });

  test('13. Duplicate param name in params list should raise non-crit error', () => {
    var lexer = new LexerImp(new StringReader("func fun(param, param) {}"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()
    expect(program.functions['fun'].parameters.length).toBe(1);
    expect(program.functions['fun'].parameters[0].name).toBe('param');
    expect(parser.did_raise_error()).toBe(true);
  });

  test('14. Duplicate function name should raise non-crit error', () => {
    var lexer = new LexerImp(new StringReader("func fun(){} func fun(){}"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()
    expect(Object.keys(program.functions).length).toBe(1);
    expect(parser.did_raise_error()).toBe(true);
  });

  test('15. Lacking function block right brace should raise non-crit error', () => {
    var lexer = new LexerImp(new StringReader("func fun(){"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()
    expect(Object.keys(program.functions).length).toBe(1);
    expect(parser.did_raise_error()).toBe(true);
  });

  test('16. Parser should succesfully parse empty ReturnStatement inside a function block', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   return;   }"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()
    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('17. Lacking statement termination should raise non-crit error', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   return   }"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()
    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(parser.did_raise_error()).toBe(true);
  });

  test('18. Parser should succesfully parse simple if statement', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   if(var){}   }"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse();
    var if_stmnt = <IfStatement>program.functions['fun'].block.statements[0];
    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(if_stmnt.condition).not.toBe(null);
    expect(if_stmnt.true_block).not.toBe(null);
    expect(if_stmnt.false_block).toBe(null);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('19. Parser should succesfully parse if else statement', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   if(var){} else{}   }"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse();
    var if_stmnt = <IfStatement>program.functions['fun'].block.statements[0];
    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(if_stmnt.condition).not.toBe(null);
    expect(if_stmnt.true_block).not.toBe(null);
    expect(if_stmnt.false_block).not.toBe(null);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('20. Parser should succesfully parse simple unless statement', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   unless(var){}   }"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse();
    var unl_stmnt = <IfStatement>program.functions['fun'].block.statements[0];
    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(unl_stmnt.condition).not.toBe(null);
    expect(unl_stmnt.true_block).not.toBe(null);
    expect(unl_stmnt.false_block).toBe(null);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('21. Parser should succesfully parse unless else statement', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   unless(var){} else{}   }"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse();
    var unl_stmnt = <IfStatement>program.functions['fun'].block.statements[0];
    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(unl_stmnt.condition).not.toBe(null);
    expect(unl_stmnt.true_block).not.toBe(null);
    expect(unl_stmnt.false_block).not.toBe(null);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('22. Lacking left brace while parsing if/unless statement should raise non-crit error', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   if var){} else{}   }"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse();
    var if_stmnt = <IfStatement>program.functions['fun'].block.statements[0];
    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(if_stmnt.condition).not.toBe(null);
    expect(if_stmnt.true_block).not.toBe(null);
    expect(if_stmnt.false_block).not.toBe(null);
    expect(parser.did_raise_error()).toBe(true);
  });

  test('23. Lacking right brace while parsing if/unless statement should raise non-crit error', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   if (var {} else{}   }"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse();
    var if_stmnt = <IfStatement>program.functions['fun'].block.statements[0];
    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(if_stmnt.condition).not.toBe(null);
    expect(if_stmnt.true_block).not.toBe(null);
    expect(if_stmnt.false_block).not.toBe(null);
    expect(parser.did_raise_error()).toBe(true);
  });

  test('24. Lacking condition while parsing if/unless statement should raise crit error', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   if () {} else{}   }"))
    var parser: ParserImp = new ParserImp(lexer);

    const parse = () => {
      parser.parse()
  };

  expect(parse).toThrow();
  expect(mock_exit).toHaveBeenCalledWith(0);
  });

  test('25. Lacking true block while parsing if/unless statement should raise crit error', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   if (var) else{}   }"))
    var parser: ParserImp = new ParserImp(lexer);

    const parse = () => {
      parser.parse()
  };

  expect(parse).toThrow();
  expect(mock_exit).toHaveBeenCalledWith(0);
  });

  test('26. Lacking false block while parsing if/unless statement should raise crit error', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   if (var){} else   }"))
    var parser: ParserImp = new ParserImp(lexer);

    const parse = () => {
      parser.parse()
  };

  expect(parse).toThrow();
  expect(mock_exit).toHaveBeenCalledWith(0);
  });

  test('27. Parser should succesfully parse simple while statement', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   while(var){}   }"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse();
    var loop_stmnt = <WhileStatement>program.functions['fun'].block.statements[0];
    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(loop_stmnt.condition).not.toBe(null);
    expect(loop_stmnt.loop_block).not.toBe(null);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('28. Lacking left brace while parsing while statement should raise non-crit error', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   while var){}   }"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse();
    var loop_stmnt = <WhileStatement>program.functions['fun'].block.statements[0];
    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(loop_stmnt.condition).not.toBe(null);
    expect(loop_stmnt.loop_block).not.toBe(null);
    expect(parser.did_raise_error()).toBe(true);
  });

  test('29. Lacking right brace while parsing while statement should raise non-crit error', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   while (var{}   }"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse();
    var loop_stmnt = <WhileStatement>program.functions['fun'].block.statements[0];
    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(loop_stmnt.condition).not.toBe(null);
    expect(loop_stmnt.loop_block).not.toBe(null);
    expect(parser.did_raise_error()).toBe(true);
  });

  test('30. Lacking condition while parsing while statement should raise crit error', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   while () {}   }"))
    var parser: ParserImp = new ParserImp(lexer);

    const parse = () => {
      parser.parse()
  };

  expect(parse).toThrow();
  expect(mock_exit).toHaveBeenCalledWith(0);
  });

  test('31. Lacking loop block while parsing while statement should raise crit error', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   while ()   }"))
    var parser: ParserImp = new ParserImp(lexer);

    const parse = () => {
      parser.parse()
    };

  expect(parse).toThrow();
  expect(mock_exit).toHaveBeenCalledWith(0);
  });

  test('32. Parser should succesfully parse simple while statement with "continue"', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   while(var){continue;}   }"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse();
    var loop_stmnt = <WhileStatement>program.functions['fun'].block.statements[0];
    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(loop_stmnt.condition).not.toBe(null);
    expect(loop_stmnt.loop_block).not.toBe(null);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('33. Parser should succesfully parse simple while statement with "break"', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   while(var){break;}   }"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse();
    var loop_stmnt = <WhileStatement>program.functions['fun'].block.statements[0];
    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(loop_stmnt.condition).not.toBe(null);
    expect(loop_stmnt.loop_block).not.toBe(null);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('34. Parser should succesfully parse simple identifier to identifier assignment', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident=ident2;   }"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()
    var assign = <AssignStatement>program.functions['fun'].block.statements[0];
    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(assign.left).not.toBe(null);
    expect(assign.right).not.toBe(null);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('35. FunCall=X assignment should raise crit-error', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   fun()=ident;   }"))
    var parser: ParserImp = new ParserImp(lexer);

    const parse = () => {
      parser.parse()
    };

  expect(parse).toThrow();
  expect(mock_exit).toHaveBeenCalledWith(0);
  });

  test('36. Standalone identifier should raise crit-error', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident;   }"))
    var parser: ParserImp = new ParserImp(lexer);

    const parse = () => {
      parser.parse()
    };

  expect(parse).toThrow();
  expect(mock_exit).toHaveBeenCalledWith(0);
  });

  test('37. Standalone member access should raise crit-error', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   obj.mem;   }"))
    var parser: ParserImp = new ParserImp(lexer);

    const parse = () => {
      parser.parse()
    };

  expect(parse).toThrow();
  expect(mock_exit).toHaveBeenCalledWith(0);
  });

  test('38. MethodCall=X assignment should raise crit-error', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   obj.meth()=ident;   }"))
    var parser: ParserImp = new ParserImp(lexer);

    const parse = () => {
      parser.parse()
    };

  expect(parse).toThrow();
  expect(mock_exit).toHaveBeenCalledWith(0);
  });

  test('39. Lacking expression in assignment should raise crit-error', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident=;   }"))
    var parser: ParserImp = new ParserImp(lexer);

    const parse = () => {
      parser.parse()
    };

  expect(parse).toThrow();
  expect(mock_exit).toHaveBeenCalledWith(0);
  });

  test('40. Parser should succesfully parse member access', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident=obj.mem;   }"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()
    var assign = <AssignStatement>program.functions['fun'].block.statements[0];
    var acc = <MemberAccess>assign.right;
    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(assign.left).not.toBe(null);
    expect(assign.right).not.toBe(null);
    expect(acc.left).not.toBe(null);
    expect(acc.right).not.toBe(null);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('41. Parser should succesfully parse assignment of function call', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident=fun();   }"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()
    var assign = <AssignStatement>program.functions['fun'].block.statements[0];
    var fun = <FunCall>assign.right;
    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(assign.left).not.toBe(null);
    expect(assign.right).not.toBe(null);
    expect(fun.fun_name).toBe('fun');
    expect(fun.args.length).toBe(0);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('42. Parser should succesfully parse assignment of method call', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident=obj.meth();   }"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()
    var assign = <AssignStatement>program.functions['fun'].block.statements[0];
    var acc = <MemberAccess>assign.right;
    var fun = <FunCall>acc.right;
    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(assign.left).not.toBe(null);
    expect(assign.right).not.toBe(null);
    expect(acc.left).not.toBe(null);
    expect(acc.right).not.toBe(null);
    expect(fun.fun_name).toBe('meth');
    expect(fun.args.length).toBe(0);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('43. Parser should succesfully parse simple function call', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   fun();   }"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()
    var fun = <FunCall>program.functions['fun'].block.statements[0];
    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(fun.fun_name).toBe('fun');
    expect(fun.args.length).toBe(0);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('44. Parser should succesfully parse simple function call with ident argument', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   fun(ident);   }"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()
    var fun = <FunCall>program.functions['fun'].block.statements[0];
    var exp1 = <Identifier>fun.args[0]

    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(fun.fun_name).toBe('fun');
    expect(fun.args.length).toBe(1);
    expect(fun.args[0] instanceof Identifier).toBe(true);
    expect(exp1.name).toBe("ident");
    expect(parser.did_raise_error()).toBe(false);
  });

  test('45. Parser should succesfully parse simple function call with multiple ident arguments', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   fun(ident, ident2, ident3);   }"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()
    var fun = <FunCall>program.functions['fun'].block.statements[0];
    var exp1 = <Identifier>fun.args[0]
    var exp2 = <Identifier>fun.args[1]
    var exp3 = <Identifier>fun.args[2]

    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(fun.fun_name).toBe('fun');
    expect(fun.args.length).toBe(3);
    expect(fun.args[0] instanceof Identifier).toBe(true);
    expect(exp1.name).toBe("ident");
    expect(fun.args[1] instanceof Identifier).toBe(true);
    expect(exp2.name).toBe("ident2");
    expect(fun.args[2] instanceof Identifier).toBe(true);
    expect(exp3.name).toBe("ident3");
    expect(parser.did_raise_error()).toBe(false);
  });

  test('46. Parser should succesfully parse simple integer constant to identifier assignment', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident=5;   }"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()

    var assign = <AssignStatement>program.functions['fun'].block.statements[0];
    var const_ = <IntConstant>assign.right;


    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(assign.left).not.toBe(null);
    expect(const_).not.toBe(null);
    expect(const_.value).toBe(5);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('47. Parser should succesfully parse simple double constant to identifier assignment', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident=5.5;   }"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()

    var assign = <AssignStatement>program.functions['fun'].block.statements[0];
    var const_ = <DoubleConstant>assign.right;


    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(assign.left).not.toBe(null);
    expect(const_).not.toBe(null);
    expect(const_.value).toBe(5.5);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('48. Parser should succesfully parse simple true constant to identifier assignment', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident=true;   }"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()

    var assign = <AssignStatement>program.functions['fun'].block.statements[0];
    var const_ = <BooleanConstant>assign.right;


    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(assign.left).not.toBe(null);
    expect(const_).not.toBe(null);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('49. Parser should succesfully parse simple false constant to identifier assignment', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident=false;   }"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()

    var assign = <AssignStatement>program.functions['fun'].block.statements[0];
    var const_ = <BooleanConstant>assign.right;


    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(assign.left).not.toBe(null);
    expect(const_).not.toBe(null);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('50. Parser should succesfully parse simple null constant to identifier assignment', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident=null;   }"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()

    var assign = <AssignStatement>program.functions['fun'].block.statements[0];
    var const_ = <NullConstant>assign.right;


    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(assign.left).not.toBe(null);
    expect(const_).not.toBe(null);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('51. Parser should succesfully parse simple string constant to identifier assignment', () => {
    var lexer = new LexerImp(new StringReader('func fun(){   ident="string";   }'))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()

    var assign = <AssignStatement>program.functions['fun'].block.statements[0];
    var const_ = <StringConstant>assign.right;


    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(assign.left).not.toBe(null);
    expect(const_).not.toBe(null);
    expect(const_.value).toBe("string");
    expect(parser.did_raise_error()).toBe(false);
  });

  test('52. Parser should succesfully parse simple function call with integer constant argument', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   fun(5);   }"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()
    var fun = <FunCall>program.functions['fun'].block.statements[0];
    var exp1 = <IntConstant>fun.args[0]

    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(fun.fun_name).toBe('fun');
    expect(fun.args.length).toBe(1);
    expect(fun.args[0] instanceof IntConstant).toBe(true);
    expect(exp1.value).toBe(5);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('53. Parser should succesfully parse simple function call with multiple integer constant arguments', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   fun(5, 10, 15);   }"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()
    var fun = <FunCall>program.functions['fun'].block.statements[0];
    var exp1 = <IntConstant>fun.args[0]
    var exp2 = <IntConstant>fun.args[1]
    var exp3 = <IntConstant>fun.args[2]

    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(fun.fun_name).toBe('fun');
    expect(fun.args.length).toBe(3);
    expect(fun.args[0] instanceof IntConstant).toBe(true);
    expect(exp1.value).toBe(5);
    expect(fun.args[1] instanceof IntConstant).toBe(true);
    expect(exp2.value).toBe(10);
    expect(fun.args[2] instanceof IntConstant).toBe(true);
    expect(exp3.value).toBe(15);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('54. Parser should succesfully parse simple function call with double constant argument', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   fun(5.5);   }"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()
    var fun = <FunCall>program.functions['fun'].block.statements[0];
    var exp1 = <DoubleConstant>fun.args[0]

    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(fun.fun_name).toBe('fun');
    expect(fun.args.length).toBe(1);
    expect(fun.args[0] instanceof DoubleConstant).toBe(true);
    expect(exp1.value).toBe(5.5);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('55. Parser should succesfully parse simple function call with multiple double constant arguments', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   fun(5.5, 10.5, 15.5);   }"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()
    var fun = <FunCall>program.functions['fun'].block.statements[0];
    var exp1 = <DoubleConstant>fun.args[0]
    var exp2 = <DoubleConstant>fun.args[1]
    var exp3 = <DoubleConstant>fun.args[2]

    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(fun.fun_name).toBe('fun');
    expect(fun.args.length).toBe(3);
    expect(fun.args[0] instanceof DoubleConstant).toBe(true);
    expect(exp1.value).toBe(5.5);
    expect(fun.args[1] instanceof DoubleConstant).toBe(true);
    expect(exp2.value).toBe(10.5);
    expect(fun.args[2] instanceof DoubleConstant).toBe(true);
    expect(exp3.value).toBe(15.5);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('56. Parser should succesfully parse simple function call with true constant argument', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   fun(true);   }"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()
    var fun = <FunCall>program.functions['fun'].block.statements[0];

    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(fun.fun_name).toBe('fun');
    expect(fun.args.length).toBe(1);
    expect(fun.args[0] instanceof BooleanConstant).toBe(true);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('57. Parser should succesfully parse simple function call with multiple true constant arguments', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   fun(true, true, true);   }"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()
    var fun = <FunCall>program.functions['fun'].block.statements[0];

    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(fun.fun_name).toBe('fun');
    expect(fun.args.length).toBe(3);
    expect(fun.args[0] instanceof BooleanConstant).toBe(true);
    expect(fun.args[1] instanceof BooleanConstant).toBe(true);
    expect(fun.args[2] instanceof BooleanConstant).toBe(true);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('58. Parser should succesfully parse simple function call with false constant argument', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   fun(false);   }"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()
    var fun = <FunCall>program.functions['fun'].block.statements[0];

    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(fun.fun_name).toBe('fun');
    expect(fun.args.length).toBe(1);
    expect(fun.args[0] instanceof BooleanConstant).toBe(true);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('59. Parser should succesfully parse simple function call with multiple false constant arguments', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   fun(false, false, false);   }"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()
    var fun = <FunCall>program.functions['fun'].block.statements[0];

    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(fun.fun_name).toBe('fun');
    expect(fun.args.length).toBe(3);
    expect(fun.args[0] instanceof BooleanConstant).toBe(true);
    expect(fun.args[1] instanceof BooleanConstant).toBe(true);
    expect(fun.args[2] instanceof BooleanConstant).toBe(true);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('60. Parser should succesfully parse simple function call with null constant argument', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   fun(null);   }"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()
    var fun = <FunCall>program.functions['fun'].block.statements[0];
    var exp1 = <NullConstant>fun.args[0]

    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(fun.fun_name).toBe('fun');
    expect(fun.args.length).toBe(1);
    expect(fun.args[0] instanceof NullConstant).toBe(true);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('61. Parser should succesfully parse simple function call with multiple null constant arguments', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   fun(null, null, null);   }"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()
    var fun = <FunCall>program.functions['fun'].block.statements[0];

    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(fun.fun_name).toBe('fun');
    expect(fun.args.length).toBe(3);
    expect(fun.args[0] instanceof NullConstant).toBe(true);
    expect(fun.args[1] instanceof NullConstant).toBe(true);
    expect(fun.args[2] instanceof NullConstant).toBe(true);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('62. Parser should succesfully parse simple function call with string constant argument', () => {
    var lexer = new LexerImp(new StringReader('func fun(){   fun("string");   }'))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()
    var fun = <FunCall>program.functions['fun'].block.statements[0];
    var exp1 = <StringConstant>fun.args[0]

    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(fun.fun_name).toBe('fun');
    expect(fun.args.length).toBe(1);
    expect(fun.args[0] instanceof StringConstant).toBe(true);
    expect(exp1.value).toBe("string");
    expect(parser.did_raise_error()).toBe(false);
  });

  test('63. Parser should succesfully parse simple function call with multiple string constant arguments', () => {
    var lexer = new LexerImp(new StringReader('func fun(){   fun("string", "string", "string");   }'))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()
    var fun = <FunCall>program.functions['fun'].block.statements[0];
    var exp1 = <StringConstant>fun.args[0]
    var exp2 = <StringConstant>fun.args[1]
    var exp3 = <StringConstant>fun.args[2]

    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(fun.fun_name).toBe('fun');
    expect(fun.args.length).toBe(3);
    expect(fun.args[0] instanceof StringConstant).toBe(true);
    expect(exp1.value).toBe("string");
    expect(fun.args[1] instanceof StringConstant).toBe(true);
    expect(exp2.value).toBe("string");
    expect(fun.args[2] instanceof StringConstant).toBe(true);
    expect(exp3.value).toBe("string");
    expect(parser.did_raise_error()).toBe(false);
  });

  test('64. Parser should succesfully parse simple addition', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident=5+10;   }"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()
    let assign = <AssignStatement>program.functions['fun'].block.statements[0];
    let addition = <Addition>assign.right
    let left = <IntConstant>addition.left
    let right = <IntConstant>addition.right
    let left_val = left.value
    let right_val = right.value

    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(left).not.toBe(null);
    expect(right).not.toBe(null);
    expect(left_val).toBe(5);
    expect(right_val).toBe(10);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('65. Parser should succesfully parse compound addition', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident=5+10+15;   }"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()
    let assign = <AssignStatement>program.functions['fun'].block.statements[0];
    let addition = <Addition>assign.right
    let left = <Addition>addition.left
    let const1 = <IntConstant>addition.right
    let const2 = <IntConstant>left.right
    let const3 = <IntConstant>left.left

    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(const1.value).toBe(15);
    expect(const2.value).toBe(10);
    expect(const3.value).toBe(5);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('66. Missing expression after addition should raise crit-error', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident=5+;   }"))
    var parser: ParserImp = new ParserImp(lexer);

    const parse = () => {
      parser.parse()
    };

  expect(parse).toThrow();
  expect(mock_exit).toHaveBeenCalledWith(0);
  });

  test('67. Parser should succesfully parse simple subtraction', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident=5-10;   }"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()
    let assign = <AssignStatement>program.functions['fun'].block.statements[0];
    let addition = <Subtraction>assign.right
    let left = <IntConstant>addition.left
    let right = <IntConstant>addition.right
    let left_val = left.value
    let right_val = right.value

    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(left).not.toBe(null);
    expect(right).not.toBe(null);
    expect(left_val).toBe(5);
    expect(right_val).toBe(10);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('68. Parser should succesfully parse compound subtraction', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident=5-10-15;   }"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()
    let assign = <AssignStatement>program.functions['fun'].block.statements[0];
    let addition = <Subtraction>assign.right
    let left = <Subtraction>addition.left
    let const1 = <IntConstant>addition.right
    let const2 = <IntConstant>left.right
    let const3 = <IntConstant>left.left

    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(const1.value).toBe(15);
    expect(const2.value).toBe(10);
    expect(const3.value).toBe(5);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('69. Missing expression after subtraction should raise crit-error', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident=5-;   }"))
    var parser: ParserImp = new ParserImp(lexer);

    const parse = () => {
      parser.parse()
    };

  expect(parse).toThrow();
  expect(mock_exit).toHaveBeenCalledWith(0);
  });

  test('70. Parser should succesfully parse simple multiplication', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident=5*10;   }"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()
    let assign = <AssignStatement>program.functions['fun'].block.statements[0];
    let addition = <Multiplication>assign.right
    let left = <IntConstant>addition.left
    let right = <IntConstant>addition.right
    let left_val = left.value
    let right_val = right.value

    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(left).not.toBe(null);
    expect(right).not.toBe(null);
    expect(left_val).toBe(5);
    expect(right_val).toBe(10);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('71. Parser should succesfully parse compound multiplication', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident=5*10*15;   }"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()
    let assign = <AssignStatement>program.functions['fun'].block.statements[0];
    let addition = <Multiplication>assign.right
    let left = <Multiplication>addition.left
    let const1 = <IntConstant>addition.right
    let const2 = <IntConstant>left.right
    let const3 = <IntConstant>left.left

    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(const1.value).toBe(15);
    expect(const2.value).toBe(10);
    expect(const3.value).toBe(5);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('72. Missing expression after multiplication should raise crit-error', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident=5*;   }"))
    var parser: ParserImp = new ParserImp(lexer);

    const parse = () => {
      parser.parse()
    };

  expect(parse).toThrow();
  expect(mock_exit).toHaveBeenCalledWith(0);
  });

  test('73. Parser should succesfully parse simple division', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident=5/10;   }"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()
    let assign = <AssignStatement>program.functions['fun'].block.statements[0];
    let addition = <Division>assign.right
    let left = <IntConstant>addition.left
    let right = <IntConstant>addition.right
    let left_val = left.value
    let right_val = right.value

    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(left).not.toBe(null);
    expect(right).not.toBe(null);
    expect(left_val).toBe(5);
    expect(right_val).toBe(10);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('74. Parser should succesfully parse compound division', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident=5/10/15;   }"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()
    let assign = <AssignStatement>program.functions['fun'].block.statements[0];
    let addition = <Division>assign.right
    let left = <Division>addition.left
    let const1 = <IntConstant>addition.right
    let const2 = <IntConstant>left.right
    let const3 = <IntConstant>left.left

    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(const1.value).toBe(15);
    expect(const2.value).toBe(10);
    expect(const3.value).toBe(5);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('75. Missing expression after division should raise crit-error', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident=5/;   }"))
    var parser: ParserImp = new ParserImp(lexer);

    const parse = () => {
      parser.parse()
    };

  expect(parse).toThrow();
  expect(mock_exit).toHaveBeenCalledWith(0);
  });

  test('76. Parser should succesfully parse simple integer division', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident=5//10;   }"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()
    let assign = <AssignStatement>program.functions['fun'].block.statements[0];
    let addition = <IntDivision>assign.right
    let left = <IntConstant>addition.left
    let right = <IntConstant>addition.right
    let left_val = left.value
    let right_val = right.value

    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(left).not.toBe(null);
    expect(right).not.toBe(null);
    expect(left_val).toBe(5);
    expect(right_val).toBe(10);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('77. Parser should succesfully parse compound integer division', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident=5//10//15;   }"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()
    let assign = <AssignStatement>program.functions['fun'].block.statements[0];
    let addition = <IntDivision>assign.right
    let left = <IntDivision>addition.left
    let const1 = <IntConstant>addition.right
    let const2 = <IntConstant>left.right
    let const3 = <IntConstant>left.left

    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(const1.value).toBe(15);
    expect(const2.value).toBe(10);
    expect(const3.value).toBe(5);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('78. Missing expression after integer division should raise crit-error', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident=5//;   }"))
    var parser: ParserImp = new ParserImp(lexer);

    const parse = () => {
      parser.parse()
    };

  expect(parse).toThrow();
  expect(mock_exit).toHaveBeenCalledWith(0);
  });

  test('79. Parser should succesfully parse simple disjunction', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident=5 || 10;   }"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()
    let assign = <AssignStatement>program.functions['fun'].block.statements[0];
    let addition = <OrExpression>assign.right
    let left = <IntConstant>addition.left
    let right = <IntConstant>addition.right
    let left_val = left.value
    let right_val = right.value

    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(left).not.toBe(null);
    expect(right).not.toBe(null);
    expect(left_val).toBe(5);
    expect(right_val).toBe(10);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('80. Parser should succesfully parse compound disjunction', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident=5 || 10 || 15;   }"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()
    let assign = <AssignStatement>program.functions['fun'].block.statements[0];
    let addition = <OrExpression>assign.right
    let left = <OrExpression>addition.left
    let const1 = <IntConstant>addition.right
    let const2 = <IntConstant>left.right
    let const3 = <IntConstant>left.left

    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(const1.value).toBe(15);
    expect(const2.value).toBe(10);
    expect(const3.value).toBe(5);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('81. Missing expression after disjunction should raise crit-error', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident=5 ||;   }"))
    var parser: ParserImp = new ParserImp(lexer);

    const parse = () => {
      parser.parse()
    };

  expect(parse).toThrow();
  expect(mock_exit).toHaveBeenCalledWith(0);
  });

  test('82. Parser should succesfully parse simple conjunction', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident=5 && 10;   }"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()
    let assign = <AssignStatement>program.functions['fun'].block.statements[0];
    let addition = <AndExpression>assign.right
    let left = <IntConstant>addition.left
    let right = <IntConstant>addition.right
    let left_val = left.value
    let right_val = right.value

    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(left).not.toBe(null);
    expect(right).not.toBe(null);
    expect(left_val).toBe(5);
    expect(right_val).toBe(10);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('83. Parser should succesfully parse compound conjunction', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident=5 && 10 && 15;   }"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()
    let assign = <AssignStatement>program.functions['fun'].block.statements[0];
    let addition = <AndExpression>assign.right
    let left = <AndExpression>addition.left
    let const1 = <IntConstant>addition.right
    let const2 = <IntConstant>left.right
    let const3 = <IntConstant>left.left

    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(const1.value).toBe(15);
    expect(const2.value).toBe(10);
    expect(const3.value).toBe(5);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('84. Missing expression after conjunction should raise crit-error', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident=5 &&;   }"))
    var parser: ParserImp = new ParserImp(lexer);

    const parse = () => {
      parser.parse()
    };

  expect(parse).toThrow();
  expect(mock_exit).toHaveBeenCalledWith(0);
  });

  test('85. Parser should succesfully parse simple conjunction', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident=5 && 10;   }"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()
    let assign = <AssignStatement>program.functions['fun'].block.statements[0];
    let addition = <AndExpression>assign.right
    let left = <IntConstant>addition.left
    let right = <IntConstant>addition.right
    let left_val = left.value
    let right_val = right.value

    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(left).not.toBe(null);
    expect(right).not.toBe(null);
    expect(left_val).toBe(5);
    expect(right_val).toBe(10);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('86. Parser should succesfully parse compound conjunction', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident=5 && 10 && 15;   }"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()
    let assign = <AssignStatement>program.functions['fun'].block.statements[0];
    let addition = <AndExpression>assign.right
    let left = <AndExpression>addition.left
    let const1 = <IntConstant>addition.right
    let const2 = <IntConstant>left.right
    let const3 = <IntConstant>left.left

    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(const1.value).toBe(15);
    expect(const2.value).toBe(10);
    expect(const3.value).toBe(5);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('87. Missing expression after conjunction should raise crit-error', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident=5 &&;   }"))
    var parser: ParserImp = new ParserImp(lexer);

    const parse = () => {
      parser.parse()
    };

  expect(parse).toThrow();
  expect(mock_exit).toHaveBeenCalledWith(0);
  });

  test('88. Parser should succesfully parse simple exponentiation', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident=5^10;   }"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()
    let assign = <AssignStatement>program.functions['fun'].block.statements[0];
    let addition = <Exponentiation>assign.right
    let left = <IntConstant>addition.left
    let right = <IntConstant>addition.right
    let left_val = left.value
    let right_val = right.value

    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(left).not.toBe(null);
    expect(right).not.toBe(null);
    expect(left_val).toBe(5);
    expect(right_val).toBe(10);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('89. Parser should succesfully parse compound exponentiation', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident=5^10^15;   }"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()
    let assign = <AssignStatement>program.functions['fun'].block.statements[0];
    let exp = <Exponentiation>assign.right
    let const1 = <IntConstant>exp.left
    let right = <Exponentiation>exp.right
    let const2 = <IntConstant>right.left
    let const3 = <IntConstant>right.right

    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(const1.value).toBe(5);
    expect(const2.value).toBe(10);
    expect(const3.value).toBe(15);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('90. Missing expression after exponentiation should raise crit-error', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident=5 ^;   }"))
    var parser: ParserImp = new ParserImp(lexer);

    const parse = () => {
      parser.parse()
    };

  expect(parse).toThrow();
  expect(mock_exit).toHaveBeenCalledWith(0);
  });

  test('91. Parser should succesfully parse simple greater comparison', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident=5>10;   }"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()
    let assign = <AssignStatement>program.functions['fun'].block.statements[0];
    let addition = <GreaterComparison>assign.right
    let left = <IntConstant>addition.left
    let right = <IntConstant>addition.right
    let left_val = left.value
    let right_val = right.value

    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(left).not.toBe(null);
    expect(right).not.toBe(null);
    expect(left_val).toBe(5);
    expect(right_val).toBe(10);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('92. Parser should raise crit-error while encountering too many greater comparison', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident=5>10>15;   }"))
    var parser: ParserImp = new ParserImp(lexer);

    const parse = () => {
      parser.parse()
    };

  expect(parse).toThrow();
  expect(mock_exit).toHaveBeenCalledWith(0);
  });

  test('93. Missing expression after greater comparison should raise crit-error', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident=5 >;   }"))
    var parser: ParserImp = new ParserImp(lexer);

    const parse = () => {
      parser.parse()
    };

  expect(parse).toThrow();
  expect(mock_exit).toHaveBeenCalledWith(0);
  });

  test('94. Parser should succesfully parse simple greater equal comparison', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident=5>=10;   }"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()
    let assign = <AssignStatement>program.functions['fun'].block.statements[0];
    let addition = <GreaterEqualComparison>assign.right
    let left = <IntConstant>addition.left
    let right = <IntConstant>addition.right
    let left_val = left.value
    let right_val = right.value

    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(left).not.toBe(null);
    expect(right).not.toBe(null);
    expect(left_val).toBe(5);
    expect(right_val).toBe(10);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('95. Parser should raise crit-error while encountering too many greater equal comparison', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident=5>=10>=15;   }"))
    var parser: ParserImp = new ParserImp(lexer);

    const parse = () => {
      parser.parse()
    };

  expect(parse).toThrow();
  expect(mock_exit).toHaveBeenCalledWith(0);
  });

  test('96. Missing expression after greater equal comparison should raise crit-error', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident=5 >=;   }"))
    var parser: ParserImp = new ParserImp(lexer);

    const parse = () => {
      parser.parse()
    };

  expect(parse).toThrow();
  expect(mock_exit).toHaveBeenCalledWith(0);
  });

  test('97. Parser should succesfully parse simple lesser comparison', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident=5<10;   }"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()
    let assign = <AssignStatement>program.functions['fun'].block.statements[0];
    let addition = <LesserComparison>assign.right
    let left = <IntConstant>addition.left
    let right = <IntConstant>addition.right
    let left_val = left.value
    let right_val = right.value

    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(left).not.toBe(null);
    expect(right).not.toBe(null);
    expect(left_val).toBe(5);
    expect(right_val).toBe(10);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('98. Parser should raise crit-error while encountering too many lesser comparison', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident=5<10<15;   }"))
    var parser: ParserImp = new ParserImp(lexer);

    const parse = () => {
      parser.parse()
    };

  expect(parse).toThrow();
  expect(mock_exit).toHaveBeenCalledWith(0);
  });

  test('99. Missing expression after lesser comparison should raise crit-error', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident=5<;   }"))
    var parser: ParserImp = new ParserImp(lexer);

    const parse = () => {
      parser.parse()
    };

  expect(parse).toThrow();
  expect(mock_exit).toHaveBeenCalledWith(0);
  });

  test('100. Parser should succesfully parse simple lesser equal comparison', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident=5<=10;   }"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()
    let assign = <AssignStatement>program.functions['fun'].block.statements[0];
    let addition = <LesserEqualComparison>assign.right
    let left = <IntConstant>addition.left
    let right = <IntConstant>addition.right
    let left_val = left.value
    let right_val = right.value

    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(left).not.toBe(null);
    expect(right).not.toBe(null);
    expect(left_val).toBe(5);
    expect(right_val).toBe(10);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('101. Parser should raise crit-error while encountering too many lesser equal comparison', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident=5<=10<=15;   }"))
    var parser: ParserImp = new ParserImp(lexer);

    const parse = () => {
      parser.parse()
    };

  expect(parse).toThrow();
  expect(mock_exit).toHaveBeenCalledWith(0);
  });

  test('102. Missing lesser equal comparison after exponentiation should raise crit-error', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident=5 <=;   }"))
    var parser: ParserImp = new ParserImp(lexer);

    const parse = () => {
      parser.parse()
    };

  expect(parse).toThrow();
  expect(mock_exit).toHaveBeenCalledWith(0);
  });

  test('103. Parser should succesfully parse simple equal comparison', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident=5==10;   }"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()
    let assign = <AssignStatement>program.functions['fun'].block.statements[0];
    let addition = <EqualComparison>assign.right
    let left = <IntConstant>addition.left
    let right = <IntConstant>addition.right
    let left_val = left.value
    let right_val = right.value

    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(left).not.toBe(null);
    expect(right).not.toBe(null);
    expect(left_val).toBe(5);
    expect(right_val).toBe(10);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('104. Parser should raise crit-error while encountering too many equal comparison', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident=5==10==15;   }"))
    var parser: ParserImp = new ParserImp(lexer);

    const parse = () => {
      parser.parse()
    };

  expect(parse).toThrow();
  expect(mock_exit).toHaveBeenCalledWith(0);
  });

  test('105. Missing expression after equal comparison should raise crit-error', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident=5 ==;   }"))
    var parser: ParserImp = new ParserImp(lexer);

    const parse = () => {
      parser.parse()
    };

  expect(parse).toThrow();
  expect(mock_exit).toHaveBeenCalledWith(0);
  });

  test('106. Parser should succesfully parse simple not equal comparison', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident=5!=10;   }"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()
    let assign = <AssignStatement>program.functions['fun'].block.statements[0];
    let addition = <NotEqualComparison>assign.right
    let left = <IntConstant>addition.left
    let right = <IntConstant>addition.right
    let left_val = left.value
    let right_val = right.value

    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(left).not.toBe(null);
    expect(right).not.toBe(null);
    expect(left_val).toBe(5);
    expect(right_val).toBe(10);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('107. Parser should raise crit-error while encountering too many not equal comparison', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident=5!=10!=15;   }"))
    var parser: ParserImp = new ParserImp(lexer);

    const parse = () => {
      parser.parse()
    };

  expect(parse).toThrow();
  expect(mock_exit).toHaveBeenCalledWith(0);
  });

  test('108. Missing not equal comparison after exponentiation should raise crit-error', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident=5 !=;   }"))
    var parser: ParserImp = new ParserImp(lexer);

    const parse = () => {
      parser.parse()
    };

  expect(parse).toThrow();
  expect(mock_exit).toHaveBeenCalledWith(0);
  });

  test('109. Parser should raise crit-error while encountering too many comparisons', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident=5!=10==15;   }"))
    var parser: ParserImp = new ParserImp(lexer);

    const parse = () => {
      parser.parse()
    };

  expect(parse).toThrow();
  expect(mock_exit).toHaveBeenCalledWith(0);
  });

  test('110. Parser should succesfully parse simple negation', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident = -10;   }"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()
    let assign = <AssignStatement>program.functions['fun'].block.statements[0];
    let addition = <Negation>assign.right;
    let const_ = <IntConstant>addition.expr;

    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(const_.value).toBe(10);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('111. Parser should succesfully parse simple logical negation', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident = !true;   }"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()
    let assign = <AssignStatement>program.functions['fun'].block.statements[0];
    let addition = <LogicalNegation>assign.right;
    let _ = <BooleanConstant>addition.expr;

    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('112. Missing expression after negation should raise crit-error', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident = -;   }"))
    var parser: ParserImp = new ParserImp(lexer);

    const parse = () => {
      parser.parse()
    };

  expect(parse).toThrow();
  expect(mock_exit).toHaveBeenCalledWith(0);
  });

  test('113. Missing expression after logical negation should raise crit-error', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident= !;   }"))
    var parser: ParserImp = new ParserImp(lexer);

    const parse = () => {
      parser.parse()
    };

  expect(parse).toThrow();
  expect(mock_exit).toHaveBeenCalledWith(0);
  });

  test('114. Parser should succesfully parse simple parenthesis expression', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident= (5+10);   }"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()
    let assign = <AssignStatement>program.functions['fun'].block.statements[0];
    let addition = <Addition>assign.right
    let left = <IntConstant>addition.left
    let right = <IntConstant>addition.right
    let left_val = left.value
    let right_val = right.value

    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(left).not.toBe(null);
    expect(right).not.toBe(null);
    expect(left_val).toBe(5);
    expect(right_val).toBe(10);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('115. Parser should succesfully parse simple parenthesis expression', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident= (5+10;   }"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()
    let assign = <AssignStatement>program.functions['fun'].block.statements[0];
    let addition = <Addition>assign.right
    let left = <IntConstant>addition.left
    let right = <IntConstant>addition.right
    let left_val = left.value
    let right_val = right.value

    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(left).not.toBe(null);
    expect(right).not.toBe(null);
    expect(left_val).toBe(5);
    expect(right_val).toBe(10);
    expect(parser.did_raise_error()).toBe(true);
  });

  test('116. Parser should succesfully parse compound parenthesis expression', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident = (5+10)*15;   }"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()
    let assign = <AssignStatement>program.functions['fun'].block.statements[0];
    let mult = <Multiplication> assign.right
    let right_mult = <IntConstant>mult.right
    let addition = <Addition>mult.left
    let left_add = <IntConstant>addition.left
    let right_add = <IntConstant>addition.right

    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(left_add).not.toBe(null);
    expect(right_add).not.toBe(null);
    expect(left_add.value).toBe(5);
    expect(right_add.value).toBe(10);
    expect(right_mult.value).toBe(15);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('117. Parser should succesfully parse simple modulo', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident=5%10;   }"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()
    let assign = <AssignStatement>program.functions['fun'].block.statements[0];
    let addition = <Modulo>assign.right
    let left = <IntConstant>addition.left
    let right = <IntConstant>addition.right
    let left_val = left.value
    let right_val = right.value

    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(left).not.toBe(null);
    expect(right).not.toBe(null);
    expect(left_val).toBe(5);
    expect(right_val).toBe(10);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('118. Parser should succesfully parse compound modulo', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident=5%10%15;   }"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()
    let assign = <AssignStatement>program.functions['fun'].block.statements[0];
    let addition = <Modulo>assign.right
    let left = <Modulo>addition.left
    let const1 = <IntConstant>addition.right
    let const2 = <IntConstant>left.right
    let const3 = <IntConstant>left.left

    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(const1.value).toBe(15);
    expect(const2.value).toBe(10);
    expect(const3.value).toBe(5);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('119. Missing expression after modulo should raise crit-error', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident=5%;   }"))
    var parser: ParserImp = new ParserImp(lexer);

    const parse = () => {
      parser.parse()
    };

  expect(parse).toThrow();
  expect(mock_exit).toHaveBeenCalledWith(0);
  });

  test('120. Parser should succesfully parse simple ReturnStatement inside a function block', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   return 5;   }"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()
    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('121. Parser should succesfully parse compound ReturnStatement inside a function block', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   return (10-20^5);   }"))
    var parser: ParserImp = new ParserImp(lexer);
    let program = parser.parse()
    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(parser.did_raise_error()).toBe(false);
  });

});
