import { ErrorHandler } from '../src/error/ErrorHandler';
import { LexerImp } from '../src/lexer/LexerImp';
import { Parser } from '../src/parser/Parser';
import { StringReader } from '../src/source/Reader';
import { IfStatement } from '../src/syntax/IfStatement';
import { WhileStatement } from '../src/syntax/WhileStatement';
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
    var parser: Parser = new Parser(lexer, error_handler);
    let program = parser.parse()
    expect(Object.keys(program.functions).length).toBe(0);
  });

  test('2. Non-FunctionDef token should raise an error', () => {
    var lexer = new LexerImp(new StringReader("x=5"), error_handler)
    var parser: Parser = new Parser(lexer, error_handler);

    const parse = () => {
        parser.parse()
    };

    expect(parse).toThrow();
    expect(mock_exit).toHaveBeenCalledWith(0);
  });

  test('3. String with function definition should return program with 1 function', () => {
    var lexer = new LexerImp(new StringReader("func fun() {}"), error_handler)
    var parser: Parser = new Parser(lexer, error_handler);
    let program = parser.parse()
    expect(Object.keys(program.functions).length).toBe(1);
  });

  test('4. String with multiple function definitions with the same name should return program with 1 functions', () => {
    var lexer = new LexerImp(new StringReader("func fun() {} \n func fun() {}"), error_handler)
    var parser: Parser = new Parser(lexer, error_handler);
    let program = parser.parse()
    expect(Object.keys(program.functions).length).toBe(1);
  });

  test('5. String with multiple function definitions should return program with multiple functions', () => {
    var lexer = new LexerImp(new StringReader("func fun() {} \n func fun2() {}"), error_handler)
    var parser: Parser = new Parser(lexer, error_handler);
    let program = parser.parse()
    expect(Object.keys(program.functions).length).toBe(2);
  });

  test('6. Function should have correct identifier name', () => {
    var lexer = new LexerImp(new StringReader("func fun() {}"), error_handler)
    var parser: Parser = new Parser(lexer, error_handler);
    let program = parser.parse()
    expect(program.functions['fun']).not.toBe(undefined);
    expect(program.functions['fun'].name).toBe('fun');
  });

  test('7. Missing identifier should raise an error', () => {
    var lexer = new LexerImp(new StringReader("func () {}"), error_handler)
    var parser: Parser = new Parser(lexer, error_handler);

    const parse = () => {
        parser.parse()
    };

    expect(parse).toThrow();
    expect(mock_exit).toHaveBeenCalledWith(0);
  });

  test('8. Missing left bracket in params list should raise non-crit error', () => {
    var lexer = new LexerImp(new StringReader("func fun param) {}"), error_handler)
    var parser: Parser = new Parser(lexer, error_handler);
    parser.parse()
    expect(parser.did_raise_error()).toBe(true);
  });

  test('9. Missing right bracket in params list should raise non-crit error', () => {
    var lexer = new LexerImp(new StringReader("func fun (param {}"), error_handler)
    var parser: Parser = new Parser(lexer, error_handler);
    parser.parse()
    expect(parser.did_raise_error()).toBe(true);
  });

  test('10. Function with one param should store correct param data', () => {
    var lexer = new LexerImp(new StringReader("func fun(param) {}"), error_handler)
    var parser: Parser = new Parser(lexer, error_handler);
    let program = parser.parse()
    expect(program.functions['fun'].parameters.length).toBe(1);
    expect(program.functions['fun'].parameters[0].name).toBe('param');
  });

  test('11. Function with multiple params should store correct params data', () => {
    var lexer = new LexerImp(new StringReader("func fun(param, param2) {}"), error_handler)
    var parser: Parser = new Parser(lexer, error_handler);
    let program = parser.parse()
    expect(program.functions['fun'].parameters.length).toBe(2);
    expect(program.functions['fun'].parameters[0].name).toBe('param');
    expect(program.functions['fun'].parameters[1].name).toBe('param2');
  });

  test('12. Trailing comma in params list should raise non-crit error', () => {
    var lexer = new LexerImp(new StringReader("func fun(param, ) {}"), error_handler)
    var parser: Parser = new Parser(lexer, error_handler);
    let program = parser.parse()
    expect(program.functions['fun'].parameters.length).toBe(1);
    expect(program.functions['fun'].parameters[0].name).toBe('param');
    expect(parser.did_raise_error()).toBe(true);
  });

  test('13. Duplicate param name in params list should raise non-crit error', () => {
    var lexer = new LexerImp(new StringReader("func fun(param, param) {}"), error_handler)
    var parser: Parser = new Parser(lexer, error_handler);
    let program = parser.parse()
    expect(program.functions['fun'].parameters.length).toBe(1);
    expect(program.functions['fun'].parameters[0].name).toBe('param');
    expect(parser.did_raise_error()).toBe(true);
  });

  test('14. Duplicate function name should raise non-crit error', () => {
    var lexer = new LexerImp(new StringReader("func fun(){} func fun(){}"), error_handler)
    var parser: Parser = new Parser(lexer, error_handler);
    let program = parser.parse()
    expect(Object.keys(program.functions).length).toBe(1);
    expect(parser.did_raise_error()).toBe(true);
  });

  test('15. Lacking function block right brace should raise non-crit error', () => {
    var lexer = new LexerImp(new StringReader("func fun(){"), error_handler)
    var parser: Parser = new Parser(lexer, error_handler);
    let program = parser.parse()
    expect(Object.keys(program.functions).length).toBe(1);
    expect(parser.did_raise_error()).toBe(true);
  });

  test('16. Parser should succesfully parse ReturnStatement inside a function block', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   return;   }"), error_handler)
    var parser: Parser = new Parser(lexer, error_handler);
    let program = parser.parse()
    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('17. Lacking statement termination should raise non-crit error', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   return   }"), error_handler)
    var parser: Parser = new Parser(lexer, error_handler);
    let program = parser.parse()
    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(parser.did_raise_error()).toBe(true);
  });

  test('18. Parser should succesfully parse simple if statement', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   if(return){}   }"), error_handler)
    var parser: Parser = new Parser(lexer, error_handler);
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
    var lexer = new LexerImp(new StringReader("func fun(){   if(return){} else{}   }"), error_handler)
    var parser: Parser = new Parser(lexer, error_handler);
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
    var lexer = new LexerImp(new StringReader("func fun(){   unless(return){}   }"), error_handler)
    var parser: Parser = new Parser(lexer, error_handler);
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
    var lexer = new LexerImp(new StringReader("func fun(){   unless(return){} else{}   }"), error_handler)
    var parser: Parser = new Parser(lexer, error_handler);
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
    var lexer = new LexerImp(new StringReader("func fun(){   if return){} else{}   }"), error_handler)
    var parser: Parser = new Parser(lexer, error_handler);
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
    var lexer = new LexerImp(new StringReader("func fun(){   if (return {} else{}   }"), error_handler)
    var parser: Parser = new Parser(lexer, error_handler);
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
    var parser: Parser = new Parser(lexer, error_handler);

    const parse = () => {
      parser.parse()
  };

  expect(parse).toThrow();
  expect(mock_exit).toHaveBeenCalledWith(0);
  });

  test('25. Lacking true block while parsing if/unless statement should raise crit error', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   if (return) else{}   }"), error_handler)
    var parser: Parser = new Parser(lexer, error_handler);

    const parse = () => {
      parser.parse()
  };

  expect(parse).toThrow();
  expect(mock_exit).toHaveBeenCalledWith(0);
  });

  test('26. Lacking false block while parsing if/unless statement should raise crit error', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   if (return){} else   }"), error_handler)
    var parser: Parser = new Parser(lexer, error_handler);

    const parse = () => {
      parser.parse()
  };

  expect(parse).toThrow();
  expect(mock_exit).toHaveBeenCalledWith(0);
  });

  test('27. Parser should succesfully parse simple while statement', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   while(return){}   }"), error_handler)
    var parser: Parser = new Parser(lexer, error_handler);
    let program = parser.parse();
    var loop_stmnt = <WhileStatement>program.functions['fun'].block.statements[0];
    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(loop_stmnt.condition).not.toBe(null);
    expect(loop_stmnt.loop_block).not.toBe(null);
    expect(parser.did_raise_error()).toBe(false);
  });

  test('28. Lacking left brace while parsing while statement should raise non-crit error', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   while return){}   }"), error_handler)
    var parser: Parser = new Parser(lexer, error_handler);
    let program = parser.parse();
    var loop_stmnt = <WhileStatement>program.functions['fun'].block.statements[0];
    expect(Object.keys(program.functions).length).toBe(1);
    expect(program.functions['fun'].block.statements.length).toBe(1);
    expect(loop_stmnt.condition).not.toBe(null);
    expect(loop_stmnt.loop_block).not.toBe(null);
    expect(parser.did_raise_error()).toBe(true);
  });

  test('29. Lacking right brace while parsing while statement should raise non-crit error', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   while (return{}   }"), error_handler)
    var parser: Parser = new Parser(lexer, error_handler);
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
    var parser: Parser = new Parser(lexer, error_handler);

    const parse = () => {
      parser.parse()
  };

  expect(parse).toThrow();
  expect(mock_exit).toHaveBeenCalledWith(0);
  });

  test('31. Lacking loop block while parsing while statement should raise crit error', () => {
    var lexer = new LexerImp(new StringReader("func fun(){   while ()   }"), error_handler)
    var parser: Parser = new Parser(lexer, error_handler);

    const parse = () => {
      parser.parse()
  };

  expect(parse).toThrow();
  expect(mock_exit).toHaveBeenCalledWith(0);
  });







});



