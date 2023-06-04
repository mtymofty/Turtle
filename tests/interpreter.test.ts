import { Color } from "../src/interpreter/builtin/objs/Color";
import { LexerImp } from "../src/lexer/LexerImp";
import { ParserImp } from "../src/parser/ParserImp";
import { StringReader } from "../src/source/Reader";
import { TestInterpreter } from "./TestInterpreter";

const mock_exit = jest.spyOn(process, 'exit')
            .mockImplementation((number) => { throw new Error('process.exit: ' + number); });


beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

describe('Interpreter integration tests:', () => {
  test('1. Constructor test', () => {
    var interpreter = new TestInterpreter();
    expect(interpreter.env).not.toBe(null);
  });

test('2. Adding bultin functions and objects', () => {
    var lexer = new LexerImp(new StringReader("func main() { return }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(interpreter.calls()["print"]).not.toBe(undefined);
    expect(interpreter.calls()["print"]).not.toBe(null);
    expect(interpreter.calls()["Color"]).not.toBe(undefined);
    expect(interpreter.calls()["Color"]).not.toBe(null);
    expect(interpreter.calls()["Pen"]).not.toBe(undefined);
    expect(interpreter.calls()["Pen"]).not.toBe(null);
    expect(interpreter.calls()["TurtlePosition"]).not.toBe(undefined);
    expect(interpreter.calls()["TurtlePosition"]).not.toBe(null);
    expect(interpreter.calls()["Turtle"]).not.toBe(undefined);
    expect(interpreter.calls()["Turtle"]).not.toBe(null);
  });

test('3. Correct recognition of main function', () => {
    var lexer = new LexerImp(new StringReader("func main() { return; }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();

    const exec = () => {
      program.accept(interpreter);
    };

    expect(exec).not.toThrow();
    expect(interpreter.calls()["main"]).not.toBe(null);

  });

test('4. ERROR - Missing main function', () => {
    var lexer = new LexerImp(new StringReader("func fun() { return; }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();

    const exec = () => {
      program.accept(interpreter);
    };

    expect(exec).toThrow();
  });

test('5. ERROR- Main function with parameters', () => {
    var lexer = new LexerImp(new StringReader("func main(param) { return; }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();

    const exec = () => {
      program.accept(interpreter);
    };

    expect(exec).toThrow();
  });

test('6. ERROR - unexpected break statement', () => {
    var lexer = new LexerImp(new StringReader("func main() { break; }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();

    const exec = () => {
      program.accept(interpreter);
    };

    expect(exec).toThrow();
  });

test('7. ERROR - unexpected continue statement', () => {
    var lexer = new LexerImp(new StringReader("func main() { continue; }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();

    const exec = () => {
      program.accept(interpreter);
    };

    expect(exec).toThrow();
  });

test('8. ERROR - accessing undefined variable', () => {
    var lexer = new LexerImp(new StringReader("func main() { return var; }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    const exec = () => {
      program.accept(interpreter);
    };

    expect(exec).toThrow();
  });

test('9. Returning integer constant', () => {
    var lexer = new LexerImp(new StringReader("func main() { return 5; }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(interpreter.result()).toBe(5);
  });

test('10. Returning double constant', () => {
    var lexer = new LexerImp(new StringReader("func main() { return 5.5; }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(interpreter.result()).toBe(5.5);
  });

test('11. Returning string constant', () => {
    var lexer = new LexerImp(new StringReader('func main() { return "abc" }'));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(interpreter.result()).toBe("abc");
  });

test('12. Returning null constant', () => {
    var lexer = new LexerImp(new StringReader("func main() { return null; }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(interpreter.result()).toBe(null);
  });

test('13. Returning boolean cosntant', () => {
    var lexer = new LexerImp(new StringReader("func main() { return true;}"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(interpreter.result()).toBe(true);
  });

test('14. Returning parenthesis constant', () => {
    var lexer = new LexerImp(new StringReader("func main() { return (5+5) }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(interpreter.result()).toBe(10);
  });

test('15. Returning compound constant', () => {
    var lexer = new LexerImp(new StringReader("func main() { return 5+5 }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(interpreter.result()).toBe(10);
  });

test('16. Empty return', () => {
    var lexer = new LexerImp(new StringReader("func main() { return }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(interpreter.result()).toBe(null);
  });

test('17. Correct operation components', () => {
    var lexer = new LexerImp(new StringReader("func main() { return 5+5 }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(interpreter.result()).toBe(10);
  });

test('18. ERROR - Incorrect operation components', () => {
    var lexer = new LexerImp(new StringReader("func main() { return true+null }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();

    const exec = () => {
      program.accept(interpreter);
    };

    expect(exec).toThrow();
  });

test('19. Calling a function with no arguments', () => {
    var lexer = new LexerImp(new StringReader("func main() { fun() } func fun() { return; }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    const exec = () => {
      program.accept(interpreter);
    };

    expect(exec).not.toThrow();
  });

test('20. ERROR - Calling a function with not enough arguments', () => {
    var lexer = new LexerImp(new StringReader("func main() { fun() } func fun(p) { return p; }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();

    const exec = () => {
      program.accept(interpreter);
    };

    expect(exec).toThrow();
  });

test('21. ERROR - Calling a function with too many arguments', () => {
    var lexer = new LexerImp(new StringReader("func main() { fun(5, 10) } func fun() { return; }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();

    const exec = () => {
      program.accept(interpreter);
    };

    expect(exec).toThrow();
  });

test('22. Assignment identifier-constant', () => {
    var lexer = new LexerImp(new StringReader("func main() { var = 5; return var; }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(interpreter.result()).toBe(5);
  });

test('23. Assignment identifier-identifier', () => {
    var lexer = new LexerImp(new StringReader("func main() { v = 5; var = v; return var; }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(interpreter.result()).toBe(5);
  });

test('24. Assignment identifier-funcall', () => {
    var lexer = new LexerImp(new StringReader("func main() { var = v(); return var; } func v() { return 5; }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(interpreter.result()).toBe(5);
  });

test('25. Assignment idenitifer-constructor', () => {
    var lexer = new LexerImp(new StringReader("func main() { obj = Color(); return obj }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    var res: Color = <Color>(interpreter.result())
    expect(res instanceof Color).toBe(true);
  });

test('26. Creating an object', () => {
    var lexer = new LexerImp(new StringReader("func main() { return Color()}"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    var res: Color = <Color>(interpreter.result())
    expect(res instanceof Color).toBe(true);
  });

test('27. ERROR - Passing not enough args to object constructor', () => {
    var lexer = new LexerImp(new StringReader("func main() { return Color(100)}"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    const exec = () => {
      program.accept(interpreter);
    };

    expect(exec).toThrow();
  });

test('28. ERROR - Passing too many args to object constructor', () => {
    var lexer = new LexerImp(new StringReader("func main() { return Color(100, 255, 255, 255, 255)}"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    const exec = () => {
      program.accept(interpreter);
    };

    expect(exec).toThrow();
  });

test('29. Passing wrong type of args to an object constructor', () => {
    var lexer = new LexerImp(new StringReader("func main() { return Color(100, 255, 255, true)}"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(true).toBe(true);
  });

test('30. ERROR - Passing illigal values of args to object constructor', () => {
    var lexer = new LexerImp(new StringReader("func main() { return Color(100, 255, 255, 1000).b}"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    // b component set to 1000 is being changed to 255 (upper lmiit)
    expect(interpreter.result()).toBe(255);
  });

test('31. Assignment member_access-constant', () => {
    var lexer = new LexerImp(new StringReader(`
    func main() {
      obj = Color();
      obj.a = 5;
      return obj;
    }`));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    var res: Color = <Color>(interpreter.result())
    expect(res.a).toBe(5);
  });

test('32. Object default constructor test', () => {
  var lexer = new LexerImp(new StringReader(`
  func main() {
    obj = Color();
    return obj;
  }`));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    var res: Color = <Color>(interpreter.result())
    expect(res.a).toBe(100);
    expect(res.r).toBe(0);
    expect(res.g).toBe(0);
    expect(res.b).toBe(0);
  });

test('33. Object parametrized constructor test', () => {
  var lexer = new LexerImp(new StringReader(`
  func main() {
    obj = Color(10, 20, 30 ,40);
    return obj;
  }`));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    var res: Color = <Color>(interpreter.result())
    expect(res.a).toBe(10);
    expect(res.r).toBe(20);
    expect(res.g).toBe(30);
    expect(res.b).toBe(40);
  });

test('34. ERROR- assigning value to non-existant property', () => {
  var lexer = new LexerImp(new StringReader(`
  func main() {
    obj = Color();
    obj.property = 5;
    return obj;
  }`));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    const exec = () => {
      program.accept(interpreter);
    };

    expect(exec).toThrow();
  });

test('35. Assignment identifier-member_access', () => {
  var lexer = new LexerImp(new StringReader(`
  func main() {
    obj = Color();
    var = obj.a
    return var;
  }`));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(interpreter.result()).toBe(100);
  });

test('36. Object method call', () => {
  var lexer = new LexerImp(new StringReader(`
  func main() {
    obj = Turtle();
    obj.forward(10);
    return;
  }`));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    const exec = () => {
      program.accept(interpreter);
    };

    expect(exec).not.toThrow();
  });

test('37. ERROR - Object non-existant method call', () => {
  var lexer = new LexerImp(new StringReader(`
  func main() {
    obj = Turtle();
    obj.method();
    return;
  }`));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    const exec = () => {
      program.accept(interpreter);
    };

    expect(exec).toThrow();
  });

test('38. ERROR - Object method call with invalid number arguments', () => {
  var lexer = new LexerImp(new StringReader(`
  func main() {
    obj = Turtle();
    obj.rotate();
    return;
  }`));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    const exec = () => {
      program.accept(interpreter);
    };

    expect(exec).toThrow();
  });

test('39. ERROR - Object method call with invalid type arguments', () => {
  var lexer = new LexerImp(new StringReader(`
  func main() {
    obj = Turtle();
    obj.rotate(true);
    return;
  }`));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    const exec = () => {
      program.accept(interpreter);
    };

    expect(exec).toThrow();
  });

test('40. ERROR - Object property assignment of wrong type', () => {
  var lexer = new LexerImp(new StringReader(`
  func main() {
    obj = Color();
    obj.a = "string";
    return;
  }`));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    const exec = () => {
      program.accept(interpreter);
    };

    expect(exec).toThrow();
  });

test('41. ', () => {
    var lexer = new LexerImp(new StringReader("func main() { return }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(true).toBe(true);
  });

test('42. ', () => {
    var lexer = new LexerImp(new StringReader("func main() { return }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(true).toBe(true);
  });

test('43. ', () => {
    var lexer = new LexerImp(new StringReader("func main() { return }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(true).toBe(true);
  });

test('44. ', () => {
    var lexer = new LexerImp(new StringReader("func main() { return }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(true).toBe(true);
  });

test('45. ', () => {
    var lexer = new LexerImp(new StringReader("func main() { return }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(true).toBe(true);
  });

test('46. ', () => {
    var lexer = new LexerImp(new StringReader("func main() { return }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(true).toBe(true);
  });

test('47. ', () => {
    var lexer = new LexerImp(new StringReader("func main() { return }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(true).toBe(true);
  });

test('48. ', () => {
    var lexer = new LexerImp(new StringReader("func main() { return }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(true).toBe(true);
  });

test('49. ', () => {
    var lexer = new LexerImp(new StringReader("func main() { return }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(true).toBe(true);
  });

test('50. ', () => {
    var lexer = new LexerImp(new StringReader("func main() { return }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(true).toBe(true);
  });

test('51. ', () => {
    var lexer = new LexerImp(new StringReader("func main() { return }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(true).toBe(true);
  });

test('52. ', () => {
    var lexer = new LexerImp(new StringReader("func main() { return }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(true).toBe(true);
  });

test('53. ', () => {
    var lexer = new LexerImp(new StringReader("func main() { return }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(true).toBe(true);
  });

test('54. ', () => {
    var lexer = new LexerImp(new StringReader("func main() { return }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(true).toBe(true);
  });

test('55. ', () => {
    var lexer = new LexerImp(new StringReader("func main() { return }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(true).toBe(true);
  });

test('56. ', () => {
    var lexer = new LexerImp(new StringReader("func main() { return }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(true).toBe(true);
  });

test('57. ', () => {
    var lexer = new LexerImp(new StringReader("func main() { return }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(true).toBe(true);
  });

test('58. ', () => {
    var lexer = new LexerImp(new StringReader("func main() { return }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(true).toBe(true);
  });

test('59. ', () => {
    var lexer = new LexerImp(new StringReader("func main() { return }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(true).toBe(true);
  });

test('60. ', () => {
    var lexer = new LexerImp(new StringReader("func main() { return }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(true).toBe(true);
  });

test('61. ', () => {
    var lexer = new LexerImp(new StringReader("func main() { return }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(true).toBe(true);
  });

test('62. ', () => {
    var lexer = new LexerImp(new StringReader("func main() { return }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(true).toBe(true);
  });

test('63. ', () => {
    var lexer = new LexerImp(new StringReader("func main() { return }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(true).toBe(true);
  });

test('64. ', () => {
    var lexer = new LexerImp(new StringReader("func main() { return }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(true).toBe(true);
  });

test('65. ', () => {
    var lexer = new LexerImp(new StringReader("func main() { return }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(true).toBe(true);
  });

test('66. ', () => {
    var lexer = new LexerImp(new StringReader("func main() { return }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(true).toBe(true);
  });

test('67. ', () => {
    var lexer = new LexerImp(new StringReader("func main() { return }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(true).toBe(true);
  });

test('68. ', () => {
    var lexer = new LexerImp(new StringReader("func main() { return }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(true).toBe(true);
  });

test('69. ', () => {
    var lexer = new LexerImp(new StringReader("func main() { return }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(true).toBe(true);
  });

test('70. ', () => {
    var lexer = new LexerImp(new StringReader("func main() { return }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(true).toBe(true);
  });

test('71. ', () => {
    var lexer = new LexerImp(new StringReader("func main() { return }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(true).toBe(true);
  });

test('72. ', () => {
    var lexer = new LexerImp(new StringReader("func main() { return }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(true).toBe(true);
  });

test('73. ', () => {
    var lexer = new LexerImp(new StringReader("func main() { return }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(true).toBe(true);
  });

test('74. ', () => {
    var lexer = new LexerImp(new StringReader("func main() { return }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(true).toBe(true);
  });

test('75. ', () => {
    var lexer = new LexerImp(new StringReader("func main() { return }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(true).toBe(true);
  });

test('76. ', () => {
    var lexer = new LexerImp(new StringReader("func main() { return }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(true).toBe(true);
  });

test('77. ', () => {
    var lexer = new LexerImp(new StringReader("func main() { return }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(true).toBe(true);
  });

test('78. ', () => {
    var lexer = new LexerImp(new StringReader("func main() { return }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(true).toBe(true);
  });

test('79. ', () => {
    var lexer = new LexerImp(new StringReader("func main() { return }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(true).toBe(true);
  });

test('80. ', () => {
    var lexer = new LexerImp(new StringReader("func main() { return }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(true).toBe(true);
  });

test('81. ', () => {
    var lexer = new LexerImp(new StringReader("func main() { return }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(true).toBe(true);
  });

test('82. ', () => {
    var lexer = new LexerImp(new StringReader("func main() { return }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(true).toBe(true);
  });

test('83. ', () => {
    var lexer = new LexerImp(new StringReader("func main() { return }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(true).toBe(true);
  });

test('84. ', () => {
    var lexer = new LexerImp(new StringReader("func main() { return }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(true).toBe(true);
  });

test('85. ', () => {
    var lexer = new LexerImp(new StringReader("func main() { return }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(true).toBe(true);
  });

test('86. ', () => {
    var lexer = new LexerImp(new StringReader("func main() { return }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(true).toBe(true);
  });

test('87. ', () => {
    var lexer = new LexerImp(new StringReader("func main() { return }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(true).toBe(true);
  });

test('88. ', () => {
    var lexer = new LexerImp(new StringReader("func main() { return }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(true).toBe(true);
  });

test('89. ', () => {
    var lexer = new LexerImp(new StringReader("func main() { return }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(true).toBe(true);
  });

test('90. ', () => {
    var lexer = new LexerImp(new StringReader("func main() { return }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(true).toBe(true);
  });

test('91. ', () => {
    var lexer = new LexerImp(new StringReader("func main() { return }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(true).toBe(true);
  });

test('92. ', () => {
    var lexer = new LexerImp(new StringReader("func main() { return }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(true).toBe(true);
  });

test('93. ', () => {
    var lexer = new LexerImp(new StringReader("func main() { return }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(true).toBe(true);
  });

test('94. ', () => {
    var lexer = new LexerImp(new StringReader("func main() { return }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(true).toBe(true);
  });

test('95. ', () => {
    var lexer = new LexerImp(new StringReader("func main() { return }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(true).toBe(true);
  });

test('96. ', () => {
    var lexer = new LexerImp(new StringReader("func main() { return }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(true).toBe(true);
  });

test('97. ', () => {
    var lexer = new LexerImp(new StringReader("func main() { return }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(true).toBe(true);
  });

test('98. ', () => {
    var lexer = new LexerImp(new StringReader("func main() { return }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(true).toBe(true);
  });

test('99. ', () => {
    var lexer = new LexerImp(new StringReader("func main() { return }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(true).toBe(true);
  });

test('100. ', () => {
    var lexer = new LexerImp(new StringReader("func main() { return }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(true).toBe(true);
  });



});
