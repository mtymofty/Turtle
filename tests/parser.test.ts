import { ErrorHandler } from '../src/error/ErrorHandler';
import { LexerImp } from '../src/lexer/LexerImp';
import { ParserImp } from '../src/parser/ParserImp';
import { StringReader } from '../src/source/Reader';
import { Argument } from '../src/syntax/expression/Argument';
import { Constant } from '../src/syntax/expression/Constant';
import { FunCall } from '../src/syntax/expression/FunCall';
import { Identifier } from '../src/syntax/expression/Identifier';
import { MemberAccess } from '../src/syntax/expression/MemberAccess';
import { AssignStatement } from '../src/syntax/statement/AssignStatement';
import { IfStatement } from '../src/syntax/statement/IfStatement';
import { WhileStatement } from '../src/syntax/statement/WhileStatement';
import { Token } from '../src/token/Token';
import { TokenType } from '../src/token/TokenType';

const mock_exit = jest.spyOn(process, 'exit')
            .mockImplementation((number) => { throw new Error('process.exit: ' + number); });


beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

var error_handler: ErrorHandler = new ErrorHandler()
let fun_def_str: string = "func fun(param1, param2, param3) {"

describe('Parser class integration tests:', () => {
  test('1. Empty string should return program with zero functions', () => {
    var lexer = new LexerImp(new StringReader(""), error_handler)
    var parser: ParserImp = new ParserImp(lexer, error_handler);
    let program = parser.parse()
    expect(Object.keys(program.functions).length).toBe(0);
  });

  test('2. Non-FunctionDef token should raise an error', () => {
    var lexer = new LexerImp(new StringReader("x=5"), error_handler)
    var parser: ParserImp = new ParserImp(lexer, error_handler);

    const parse = () => {
        parser.parse()
    };

    expect(parse).toThrow();
    expect(mock_exit).toHaveBeenCalledWith(0);
  });

  test('3. String with function definition should return program with 1 function', () => {
    var lexer = new LexerImp(new StringReader("func fun() {}"), error_handler)
    var parser: ParserImp = new ParserImp(lexer, error_handler);
    let program = parser.parse()
    expect(Object.keys(program.functions).length).toBe(1);
  });

  test('4. String with multiple function definitions with the same name should return program with 1 functions', () => {
    var lexer = new LexerImp(new StringReader("func fun() {} \n func fun() {}"), error_handler)
    var parser: ParserImp = new ParserImp(lexer, error_handler);
    let program = parser.parse()
    expect(Object.keys(program.functions).length).toBe(1);
  });

  test('5. String with multiple function definitions should return program with multiple functions', () => {
    var lexer = new LexerImp(new StringReader("func fun() {} \n func fun2() {}"), error_handler)
    var parser: ParserImp = new ParserImp(lexer, error_handler);
    let program = parser.parse()
    expect(Object.keys(program.functions).length).toBe(2);
  });

  test('6. Function should have correct identifier name', () => {
    var lexer = new LexerImp(new StringReader("func fun() {}"), error_handler)
    var parser: ParserImp = new ParserImp(lexer, error_handler);
    let program = parser.parse()
    expect(program.functions['fun']).not.toBe(undefined);
    expect(program.functions['fun'].name).toBe('fun');
  });

  test('7. Missing identifier should raise an error', () => {
    var lexer = new LexerImp(new StringReader("func () {}"), error_handler)
    var parser: ParserImp = new ParserImp(lexer, error_handler);

    const parse = () => {
        parser.parse()
    };

    expect(parse).toThrow();
    expect(mock_exit).toHaveBeenCalledWith(0);
  });

  test('8. Missing left bracket in params list should raise non-crit error', () => {
    var lexer = new LexerImp(new StringReader("func fun param) {}"), error_handler)
    var parser: ParserImp = new ParserImp(lexer, error_handler);
    parser.parse()
    expect(parser.did_raise_error()).toBe(true);
  });

  test('9. Missing right bracket in params list should raise non-crit error', () => {
    var lexer = new LexerImp(new StringReader("func fun (param {}"), error_handler)
    var parser: ParserImp = new ParserImp(lexer, error_handler);
    parser.parse()
    expect(parser.did_raise_error()).toBe(true);
  });

  test('10. Function with one param should store correct param data', () => {
    var lexer = new LexerImp(new StringReader("func fun(param) {}"), error_handler)
    var parser: ParserImp = new ParserImp(lexer, error_handler);
    let program = parser.parse()
    expect(program.functions['fun'].parameters.length).toBe(1);
    expect(program.functions['fun'].parameters[0].name).toBe('param');
  });

  test('11. Function with multiple params should store correct params data', () => {
    var lexer = new LexerImp(new StringReader("func fun(param, param2) {}"), error_handler)
    var parser: ParserImp = new ParserImp(lexer, error_handler);
    let program = parser.parse()
    expect(program.functions['fun'].parameters.length).toBe(2);
    expect(program.functions['fun'].parameters[0].name).toBe('param');
    expect(program.functions['fun'].parameters[1].name).toBe('param2');
  });

  test('12. Trailing comma in params list should raise non-crit error', () => {
    var lexer = new LexerImp(new StringReader("func fun(param, ) {}"), error_handler)
    var parser: ParserImp = new ParserImp(lexer, error_handler);
    let program = parser.parse()
    expect(program.functions['fun'].parameters.length).toBe(1);
    expect(program.functions['fun'].parameters[0].name).toBe('param');
    expect(parser.did_raise_error()).toBe(true);
  });

  test('13. Duplicate param name in params list should raise non-crit error', () => {
    var lexer = new LexerImp(new StringReader("func fun(param, param) {}"), error_handler)
    var parser: ParserImp = new ParserImp(lexer, error_handler);
    let program = parser.parse()
    expect(program.functions['fun'].parameters.length).toBe(1);
    expect(program.functions['fun'].parameters[0].name).toBe('param');
    expect(parser.did_raise_error()).toBe(true);
  });

  test('14. Duplicate function name should raise non-crit error', () => {
    var lexer = new LexerImp(new StringReader("func fun(){} func fun(){}"), error_handler)
    var parser: ParserImp = new ParserImp(lexer, error_handler);
    let program = parser.parse()
    expect(Object.keys(program.functions).length).toBe(1);
    expect(parser.did_raise_error()).toBe(true);
  });

  test('15. Lacking function block right brace should raise non-crit error', () => {
    var lexer = new LexerImp(new StringReader("func fun(){"), error_handler)
    var parser: ParserImp = new ParserImp(lexer, error_handler);
    let program = parser.parse()
    expect(Object.keys(program.functions).length).toBe(1);
    expect(parser.did_raise_error()).toBe(true);
  });

  test('16. Parser should succesfully parse ReturnStatement inside a function block', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   return;   }"), error_handler)
    var parser: ParserImp = new ParserImp(lexer, error_handler);
    let program = parser.parse()
    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('17. Lacking statement termination should raise non-crit error', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   return   }"), error_handler)
    var parser: ParserImp = new ParserImp(lexer, error_handler);
    let program = parser.parse()
    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(parser.did_raise_error()).toBe(true);
  });

  test('18. Parser should succesfully parse simple if statement', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   if(var){}   }"), error_handler)
    var parser: ParserImp = new ParserImp(lexer, error_handler);
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
    var lexer = new LexerImp(new StringReader("func fun(){   if(var){} else{}   }"), error_handler)
    var parser: ParserImp = new ParserImp(lexer, error_handler);
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
    var lexer = new LexerImp(new StringReader("func fun(){   unless(var){}   }"), error_handler)
    var parser: ParserImp = new ParserImp(lexer, error_handler);
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
    var lexer = new LexerImp(new StringReader("func fun(){   unless(var){} else{}   }"), error_handler)
    var parser: ParserImp = new ParserImp(lexer, error_handler);
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
    var lexer = new LexerImp(new StringReader("func fun(){   if var){} else{}   }"), error_handler)
    var parser: ParserImp = new ParserImp(lexer, error_handler);
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
    var lexer = new LexerImp(new StringReader("func fun(){   if (var {} else{}   }"), error_handler)
    var parser: ParserImp = new ParserImp(lexer, error_handler);
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
    var lexer = new LexerImp(new StringReader("func fun(){   if () {} else{}   }"), error_handler)
    var parser: ParserImp = new ParserImp(lexer, error_handler);

    const parse = () => {
      parser.parse()
  };

  expect(parse).toThrow();
  expect(mock_exit).toHaveBeenCalledWith(0);
  });

  test('25. Lacking true block while parsing if/unless statement should raise crit error', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   if (var) else{}   }"), error_handler)
    var parser: ParserImp = new ParserImp(lexer, error_handler);

    const parse = () => {
      parser.parse()
  };

  expect(parse).toThrow();
  expect(mock_exit).toHaveBeenCalledWith(0);
  });

  test('26. Lacking false block while parsing if/unless statement should raise crit error', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   if (var){} else   }"), error_handler)
    var parser: ParserImp = new ParserImp(lexer, error_handler);

    const parse = () => {
      parser.parse()
  };

  expect(parse).toThrow();
  expect(mock_exit).toHaveBeenCalledWith(0);
  });

  test('27. Parser should succesfully parse simple while statement', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   while(var){}   }"), error_handler)
    var parser: ParserImp = new ParserImp(lexer, error_handler);
    let program = parser.parse();
    var loop_stmnt = <WhileStatement>program.functions['fun'].block.statements[0];
    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(loop_stmnt.condition).not.toBe(null);
    expect(loop_stmnt.loop_block).not.toBe(null);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('28. Lacking left brace while parsing while statement should raise non-crit error', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   while var){}   }"), error_handler)
    var parser: ParserImp = new ParserImp(lexer, error_handler);
    let program = parser.parse();
    var loop_stmnt = <WhileStatement>program.functions['fun'].block.statements[0];
    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(loop_stmnt.condition).not.toBe(null);
    expect(loop_stmnt.loop_block).not.toBe(null);
    expect(parser.did_raise_error()).toBe(true);
  });

  test('29. Lacking right brace while parsing while statement should raise non-crit error', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   while (var{}   }"), error_handler)
    var parser: ParserImp = new ParserImp(lexer, error_handler);
    let program = parser.parse();
    var loop_stmnt = <WhileStatement>program.functions['fun'].block.statements[0];
    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(loop_stmnt.condition).not.toBe(null);
    expect(loop_stmnt.loop_block).not.toBe(null);
    expect(parser.did_raise_error()).toBe(true);
  });

  test('30. Lacking condition while parsing while statement should raise crit error', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   while () {}   }"), error_handler)
    var parser: ParserImp = new ParserImp(lexer, error_handler);

    const parse = () => {
      parser.parse()
  };

  expect(parse).toThrow();
  expect(mock_exit).toHaveBeenCalledWith(0);
  });

  test('31. Lacking loop block while parsing while statement should raise crit error', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   while ()   }"), error_handler)
    var parser: ParserImp = new ParserImp(lexer, error_handler);

    const parse = () => {
      parser.parse()
    };

  expect(parse).toThrow();
  expect(mock_exit).toHaveBeenCalledWith(0);
  });

  test('32. Parser should succesfully parse simple while statement with "continue"', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   while(var){continue;}   }"), error_handler)
    var parser: ParserImp = new ParserImp(lexer, error_handler);
    let program = parser.parse();
    var loop_stmnt = <WhileStatement>program.functions['fun'].block.statements[0];
    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(loop_stmnt.condition).not.toBe(null);
    expect(loop_stmnt.loop_block).not.toBe(null);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('33. Parser should succesfully parse simple while statement with "break"', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   while(var){break;}   }"), error_handler)
    var parser: ParserImp = new ParserImp(lexer, error_handler);
    let program = parser.parse();
    var loop_stmnt = <WhileStatement>program.functions['fun'].block.statements[0];
    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(loop_stmnt.condition).not.toBe(null);
    expect(loop_stmnt.loop_block).not.toBe(null);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('34. Parser should succesfully parse simple identifier to identifier assignment', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident=ident2;   }"), error_handler)
    var parser: ParserImp = new ParserImp(lexer, error_handler);
    let program = parser.parse()
    var assign = <AssignStatement>program.functions['fun'].block.statements[0];
    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(assign.left).not.toBe(null);
    expect(assign.right).not.toBe(null);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('35. FunCall=X assignment should raise crit-error', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   fun()=ident;   }"), error_handler)
    var parser: ParserImp = new ParserImp(lexer, error_handler);

    const parse = () => {
      parser.parse()
    };

  expect(parse).toThrow();
  expect(mock_exit).toHaveBeenCalledWith(0);
  });

  test('36. Standalone identifier should raise crit-error', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident;   }"), error_handler)
    var parser: ParserImp = new ParserImp(lexer, error_handler);

    const parse = () => {
      parser.parse()
    };

  expect(parse).toThrow();
  expect(mock_exit).toHaveBeenCalledWith(0);
  });

  test('37. Standalone member access should raise crit-error', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   obj.mem;   }"), error_handler)
    var parser: ParserImp = new ParserImp(lexer, error_handler);

    const parse = () => {
      parser.parse()
    };

  expect(parse).toThrow();
  expect(mock_exit).toHaveBeenCalledWith(0);
  });

  test('38. MethodCall=X assignment should raise crit-error', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   obj.meth()=ident;   }"), error_handler)
    var parser: ParserImp = new ParserImp(lexer, error_handler);

    const parse = () => {
      parser.parse()
    };

  expect(parse).toThrow();
  expect(mock_exit).toHaveBeenCalledWith(0);
  });

  test('39. Lacking expression in assignment should raise crit-error', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident=;   }"), error_handler)
    var parser: ParserImp = new ParserImp(lexer, error_handler);

    const parse = () => {
      parser.parse()
    };

  expect(parse).toThrow();
  expect(mock_exit).toHaveBeenCalledWith(0);
  });

  test('40. Parser should succesfully parse member access', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident=obj.mem;   }"), error_handler)
    var parser: ParserImp = new ParserImp(lexer, error_handler);
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
    var lexer = new LexerImp(new StringReader("func fun(){   ident=fun();   }"), error_handler)
    var parser: ParserImp = new ParserImp(lexer, error_handler);
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
    var lexer = new LexerImp(new StringReader("func fun(){   ident=obj.meth();   }"), error_handler)
    var parser: ParserImp = new ParserImp(lexer, error_handler);
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
    var lexer = new LexerImp(new StringReader("func fun(){   fun();   }"), error_handler)
    var parser: ParserImp = new ParserImp(lexer, error_handler);
    let program = parser.parse()
    var fun = <FunCall>program.functions['fun'].block.statements[0];
    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(fun.fun_name).toBe('fun');
    expect(fun.args.length).toBe(0);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('44. Parser should succesfully parse simple function call with ident argument', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   fun(ident);   }"), error_handler)
    var parser: ParserImp = new ParserImp(lexer, error_handler);
    let program = parser.parse()
    var fun = <FunCall>program.functions['fun'].block.statements[0];
    var exp1 = <Identifier>fun.args[0].expression

    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(fun.fun_name).toBe('fun');
    expect(fun.args.length).toBe(1);
    expect(fun.args[0].expression instanceof Identifier).toBe(true);
    expect(exp1.name).toBe("ident");
    expect(parser.did_raise_error()).toBe(false);
  });

  test('45. Parser should succesfully parse simple function call with multiple ident arguments', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   fun(ident, ident2, ident3);   }"), error_handler)
    var parser: ParserImp = new ParserImp(lexer, error_handler);
    let program = parser.parse()
    var fun = <FunCall>program.functions['fun'].block.statements[0];
    var exp1 = <Identifier>fun.args[0].expression
    var exp2 = <Identifier>fun.args[1].expression
    var exp3 = <Identifier>fun.args[2].expression

    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(fun.fun_name).toBe('fun');
    expect(fun.args.length).toBe(3);
    expect(fun.args[0].expression instanceof Identifier).toBe(true);
    expect(exp1.name).toBe("ident");
    expect(fun.args[1].expression instanceof Identifier).toBe(true);
    expect(exp2.name).toBe("ident2");
    expect(fun.args[2].expression instanceof Identifier).toBe(true);
    expect(exp3.name).toBe("ident3");
    expect(parser.did_raise_error()).toBe(false);
  });

  test('46. Parser should succesfully parse simple integer constant to identifier assignment', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident=5;   }"), error_handler)
    var parser: ParserImp = new ParserImp(lexer, error_handler);
    let program = parser.parse()

    var assign = <AssignStatement>program.functions['fun'].block.statements[0];
    var const_ = <Constant>assign.right;


    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(assign.left).not.toBe(null);
    expect(const_).not.toBe(null);
    expect(const_.value).toBe(5);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('47. Parser should succesfully parse simple double constant to identifier assignment', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident=5.5;   }"), error_handler)
    var parser: ParserImp = new ParserImp(lexer, error_handler);
    let program = parser.parse()

    var assign = <AssignStatement>program.functions['fun'].block.statements[0];
    var const_ = <Constant>assign.right;


    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(assign.left).not.toBe(null);
    expect(const_).not.toBe(null);
    expect(const_.value).toBe(5.5);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('48. Parser should succesfully parse simple true constant to identifier assignment', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident=true;   }"), error_handler)
    var parser: ParserImp = new ParserImp(lexer, error_handler);
    let program = parser.parse()

    var assign = <AssignStatement>program.functions['fun'].block.statements[0];
    var const_ = <Constant>assign.right;


    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(assign.left).not.toBe(null);
    expect(const_).not.toBe(null);
    expect(const_.value).toBe(true);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('49. Parser should succesfully parse simple false constant to identifier assignment', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident=false;   }"), error_handler)
    var parser: ParserImp = new ParserImp(lexer, error_handler);
    let program = parser.parse()

    var assign = <AssignStatement>program.functions['fun'].block.statements[0];
    var const_ = <Constant>assign.right;


    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(assign.left).not.toBe(null);
    expect(const_).not.toBe(null);
    expect(const_.value).toBe(false);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('50. Parser should succesfully parse simple null constant to identifier assignment', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   ident=null;   }"), error_handler)
    var parser: ParserImp = new ParserImp(lexer, error_handler);
    let program = parser.parse()

    var assign = <AssignStatement>program.functions['fun'].block.statements[0];
    var const_ = <Constant>assign.right;


    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(assign.left).not.toBe(null);
    expect(const_).not.toBe(null);
    expect(const_.value).toBe(null);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('51. Parser should succesfully parse simple string constant to identifier assignment', () => {
    var lexer = new LexerImp(new StringReader('func fun(){   ident="string";   }'), error_handler)
    var parser: ParserImp = new ParserImp(lexer, error_handler);
    let program = parser.parse()

    var assign = <AssignStatement>program.functions['fun'].block.statements[0];
    var const_ = <Constant>assign.right;


    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(assign.left).not.toBe(null);
    expect(const_).not.toBe(null);
    expect(const_.value).toBe("string");
    expect(parser.did_raise_error()).toBe(false);
  });

  test('52. Parser should succesfully parse simple function call with integer constant argument', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   fun(5);   }"), error_handler)
    var parser: ParserImp = new ParserImp(lexer, error_handler);
    let program = parser.parse()
    var fun = <FunCall>program.functions['fun'].block.statements[0];
    var exp1 = <Constant>fun.args[0].expression

    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(fun.fun_name).toBe('fun');
    expect(fun.args.length).toBe(1);
    expect(fun.args[0].expression instanceof Constant).toBe(true);
    expect(exp1.value).toBe(5);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('53. Parser should succesfully parse simple function call with multiple integer constant arguments', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   fun(5, 10, 15);   }"), error_handler)
    var parser: ParserImp = new ParserImp(lexer, error_handler);
    let program = parser.parse()
    var fun = <FunCall>program.functions['fun'].block.statements[0];
    var exp1 = <Constant>fun.args[0].expression
    var exp2 = <Constant>fun.args[1].expression
    var exp3 = <Constant>fun.args[2].expression

    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(fun.fun_name).toBe('fun');
    expect(fun.args.length).toBe(3);
    expect(fun.args[0].expression instanceof Constant).toBe(true);
    expect(exp1.value).toBe(5);
    expect(fun.args[1].expression instanceof Constant).toBe(true);
    expect(exp2.value).toBe(10);
    expect(fun.args[2].expression instanceof Constant).toBe(true);
    expect(exp3.value).toBe(15);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('54. Parser should succesfully parse simple function call with double constant argument', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   fun(5.5);   }"), error_handler)
    var parser: ParserImp = new ParserImp(lexer, error_handler);
    let program = parser.parse()
    var fun = <FunCall>program.functions['fun'].block.statements[0];
    var exp1 = <Constant>fun.args[0].expression

    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(fun.fun_name).toBe('fun');
    expect(fun.args.length).toBe(1);
    expect(fun.args[0].expression instanceof Constant).toBe(true);
    expect(exp1.value).toBe(5.5);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('55. Parser should succesfully parse simple function call with multiple double constant arguments', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   fun(5.5, 10.5, 15.5);   }"), error_handler)
    var parser: ParserImp = new ParserImp(lexer, error_handler);
    let program = parser.parse()
    var fun = <FunCall>program.functions['fun'].block.statements[0];
    var exp1 = <Constant>fun.args[0].expression
    var exp2 = <Constant>fun.args[1].expression
    var exp3 = <Constant>fun.args[2].expression

    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(fun.fun_name).toBe('fun');
    expect(fun.args.length).toBe(3);
    expect(fun.args[0].expression instanceof Constant).toBe(true);
    expect(exp1.value).toBe(5.5);
    expect(fun.args[1].expression instanceof Constant).toBe(true);
    expect(exp2.value).toBe(10.5);
    expect(fun.args[2].expression instanceof Constant).toBe(true);
    expect(exp3.value).toBe(15.5);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('56. Parser should succesfully parse simple function call with true constant argument', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   fun(true);   }"), error_handler)
    var parser: ParserImp = new ParserImp(lexer, error_handler);
    let program = parser.parse()
    var fun = <FunCall>program.functions['fun'].block.statements[0];
    var exp1 = <Constant>fun.args[0].expression

    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(fun.fun_name).toBe('fun');
    expect(fun.args.length).toBe(1);
    expect(fun.args[0].expression instanceof Constant).toBe(true);
    expect(exp1.value).toBe(true);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('57. Parser should succesfully parse simple function call with multiple true constant arguments', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   fun(true, true, true);   }"), error_handler)
    var parser: ParserImp = new ParserImp(lexer, error_handler);
    let program = parser.parse()
    var fun = <FunCall>program.functions['fun'].block.statements[0];
    var exp1 = <Constant>fun.args[0].expression
    var exp2 = <Constant>fun.args[1].expression
    var exp3 = <Constant>fun.args[2].expression

    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(fun.fun_name).toBe('fun');
    expect(fun.args.length).toBe(3);
    expect(fun.args[0].expression instanceof Constant).toBe(true);
    expect(exp1.value).toBe(true);
    expect(fun.args[1].expression instanceof Constant).toBe(true);
    expect(exp2.value).toBe(true);
    expect(fun.args[2].expression instanceof Constant).toBe(true);
    expect(exp3.value).toBe(true);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('58. Parser should succesfully parse simple function call with false constant argument', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   fun(false);   }"), error_handler)
    var parser: ParserImp = new ParserImp(lexer, error_handler);
    let program = parser.parse()
    var fun = <FunCall>program.functions['fun'].block.statements[0];
    var exp1 = <Constant>fun.args[0].expression

    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(fun.fun_name).toBe('fun');
    expect(fun.args.length).toBe(1);
    expect(fun.args[0].expression instanceof Constant).toBe(true);
    expect(exp1.value).toBe(false);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('59. Parser should succesfully parse simple function call with multiple false constant arguments', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   fun(false, false, false);   }"), error_handler)
    var parser: ParserImp = new ParserImp(lexer, error_handler);
    let program = parser.parse()
    var fun = <FunCall>program.functions['fun'].block.statements[0];
    var exp1 = <Constant>fun.args[0].expression
    var exp2 = <Constant>fun.args[1].expression
    var exp3 = <Constant>fun.args[2].expression

    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(fun.fun_name).toBe('fun');
    expect(fun.args.length).toBe(3);
    expect(fun.args[0].expression instanceof Constant).toBe(true);
    expect(exp1.value).toBe(false);
    expect(fun.args[1].expression instanceof Constant).toBe(true);
    expect(exp2.value).toBe(false);
    expect(fun.args[2].expression instanceof Constant).toBe(true);
    expect(exp3.value).toBe(false);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('60. Parser should succesfully parse simple function call with null constant argument', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   fun(null);   }"), error_handler)
    var parser: ParserImp = new ParserImp(lexer, error_handler);
    let program = parser.parse()
    var fun = <FunCall>program.functions['fun'].block.statements[0];
    var exp1 = <Constant>fun.args[0].expression

    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(fun.fun_name).toBe('fun');
    expect(fun.args.length).toBe(1);
    expect(fun.args[0].expression instanceof Constant).toBe(true);
    expect(exp1.value).toBe(null);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('61. Parser should succesfully parse simple function call with multiple null constant arguments', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   fun(null, null, null);   }"), error_handler)
    var parser: ParserImp = new ParserImp(lexer, error_handler);
    let program = parser.parse()
    var fun = <FunCall>program.functions['fun'].block.statements[0];
    var exp1 = <Constant>fun.args[0].expression
    var exp2 = <Constant>fun.args[1].expression
    var exp3 = <Constant>fun.args[2].expression

    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(fun.fun_name).toBe('fun');
    expect(fun.args.length).toBe(3);
    expect(fun.args[0].expression instanceof Constant).toBe(true);
    expect(exp1.value).toBe(null);
    expect(fun.args[1].expression instanceof Constant).toBe(true);
    expect(exp2.value).toBe(null);
    expect(fun.args[2].expression instanceof Constant).toBe(true);
    expect(exp3.value).toBe(null);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('62. Parser should succesfully parse simple function call with string constant argument', () => {
    var lexer = new LexerImp(new StringReader('func fun(){   fun("string");   }'), error_handler)
    var parser: ParserImp = new ParserImp(lexer, error_handler);
    let program = parser.parse()
    var fun = <FunCall>program.functions['fun'].block.statements[0];
    var exp1 = <Constant>fun.args[0].expression

    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(fun.fun_name).toBe('fun');
    expect(fun.args.length).toBe(1);
    expect(fun.args[0].expression instanceof Constant).toBe(true);
    expect(exp1.value).toBe("string");
    expect(parser.did_raise_error()).toBe(false);
  });

  test('63. Parser should succesfully parse simple function call with multiple string constant arguments', () => {
    var lexer = new LexerImp(new StringReader('func fun(){   fun("string", "string", "string");   }'), error_handler)
    var parser: ParserImp = new ParserImp(lexer, error_handler);
    let program = parser.parse()
    var fun = <FunCall>program.functions['fun'].block.statements[0];
    var exp1 = <Constant>fun.args[0].expression
    var exp2 = <Constant>fun.args[1].expression
    var exp3 = <Constant>fun.args[2].expression

    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(fun.fun_name).toBe('fun');
    expect(fun.args.length).toBe(3);
    expect(fun.args[0].expression instanceof Constant).toBe(true);
    expect(exp1.value).toBe("string");
    expect(fun.args[1].expression instanceof Constant).toBe(true);
    expect(exp2.value).toBe("string");
    expect(fun.args[2].expression instanceof Constant).toBe(true);
    expect(exp3.value).toBe("string");
    expect(parser.did_raise_error()).toBe(false);
  });





});



