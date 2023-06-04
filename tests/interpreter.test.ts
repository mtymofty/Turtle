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
    expect(interpreter.env_()).not.toBe(null);
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

test('5. ERROR - Main function with parameters', () => {
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

test('29. ERROR - Passing wrong type of args to an object constructor', () => {
    var lexer = new LexerImp(new StringReader("func main() { return Color(100, 255, 255, true)}"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();

    const exec = () => {
      program.accept(interpreter);
    };

    expect(exec).toThrow();
  });

test('30. Passing illigal values of args to object constructor', () => {
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

test('34. ERROR - Assigning value to non-existant property', () => {
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

test('41. ERROR - accesing property of primitive type variable', () => {
  var lexer = new LexerImp(new StringReader(`
  func main() {
    var = 5;
    var.prop = 10;
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

test('42. ERROR - accesing method of primitive type variable', () => {
  var lexer = new LexerImp(new StringReader(`
  func main() {
    var = 5;
    var.prop();
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

test('43. Primitive type variables are not mutable in funcall', () => {
  var lexer = new LexerImp(new StringReader(`
  func main() {
    var = 5
    fun(5)
    return var;
  }
  func fun(num) {
    num = 10
  }
  `));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(interpreter.result()).toBe(5);
  });

test('44. Variables are accessed from correct function context', () => {
  var lexer = new LexerImp(new StringReader(`
  func main() {
    var = 5

    res = fun(20)
    return res;
  }
  func fun(var) {
    return var
  }
  `));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(interpreter.result()).toBe(20);
  });

test('45. Objects are mutable in funcall', () => {
  var lexer = new LexerImp(new StringReader(`
  func main() {
    obj = Color()

    fun(obj)
    return obj.a;
  }
  func fun(obj) {
    obj.a = 5
  }
  `));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(interpreter.result()).toBe(5);
  });

test('46. Assigning object to variable by reference', () => {
  var lexer = new LexerImp(new StringReader(`
  func main() {
    obj = Color()
    obj2 = obj

    obj.a = 50
    obj2.a = 5;

    return (obj.a==obj2.a) && (obj.a==5);
  }
  `));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(interpreter.result()).toBe(true);
  });

test('47. Assigning primitive type constant to variable by value', () => {
  var lexer = new LexerImp(new StringReader(`
  func main() {
    var = 500
    var2 = var

    var = 50
    var2 = 5;

    return (var != var2) && (var==50);
  }
  `));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(interpreter.result()).toBe(true);
  });

test('48. ERROR - Calling non-existant function', () => {
    var lexer = new LexerImp(new StringReader("func main() { fun() }"));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    const exec = () => {
      program.accept(interpreter);
    };

    expect(exec).toThrow();
  });

test('49. Simple IF Statement, with constant condition', () => {
  var lexer = new LexerImp(new StringReader(`
  func main() {
    if (1) {
      return 1;
    }
    return 0;
  }
  `));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(interpreter.result()).toBe(1);
  });

test('50. Simple IF Statement, with comparison condition', () => {
  var lexer = new LexerImp(new StringReader(`
  func main() {
    if (1>0) {
      return 1;
    }
    return 0;
  }
  `));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(interpreter.result()).toBe(1);
  });

test('51. Simple IF Statement, with compound arithmetic condition', () => {
  var lexer = new LexerImp(new StringReader(`
  func main() {
    if (5+5-5 == 5) {
      return 1;
    }
    return 0;
  }
  `));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(interpreter.result()).toBe(1);
  });

test('52. Simple IF Statement, with identifier condition', () => {
  var lexer = new LexerImp(new StringReader(`
  func main() {
    var = 1;
    if (var) {
      return 1;
    }
    return 0;
  }
  `));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(interpreter.result()).toBe(1);
  });

test('53. IF-ELSE Statement, with true condition', () => {
  var lexer = new LexerImp(new StringReader(`
  func main() {
    var = 1;
    if (var) {
      return 1;
    } else {
      return 0;
    }
  }
  `));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(interpreter.result()).toBe(1);
  });

test('54. IF-ELSE Statement, with false condition', () => {
  var lexer = new LexerImp(new StringReader(`
  func main() {
    var = null;
    if (var) {
      return 1;
    } else {
      return 0;
    }
  }
  `));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(interpreter.result()).toBe(0);
  });

test('55. Simple UNLESS Statement, with true condition', () => {
  var lexer = new LexerImp(new StringReader(`
  func main() {
    var = true;
    unless (var) {
      return 1;
    }

    return 0;
  }
  `));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(interpreter.result()).toBe(0);
  });

test('56. UNLESS-ELSE Statement, with true condition', () => {
  var lexer = new LexerImp(new StringReader(`
  func main() {
    var = true;
    unless (var) {
      return 1;
    } else {
      return 0
    }
  }
  `));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(interpreter.result()).toBe(0);
  });

test('57. Simple UNLESS Statement, with false condition', () => {
  var lexer = new LexerImp(new StringReader(`
  func main() {
    var = false;
    unless (var) {
      return 1;
    }

    return 0;
  }
  `));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(interpreter.result()).toBe(1);
  });

test('58. UNLESS-ELSE Statement, with false condition', () => {
  var lexer = new LexerImp(new StringReader(`
  func main() {
    var = null;
    unless (var) {
      return 1;
    } else {
      return 0
    }
  }
  `));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(interpreter.result()).toBe(1);
  });

test('59. Assignment of void function return value', () => {
  var lexer = new LexerImp(new StringReader(`
  func main() {
    var = fun(5+5);
    return var;

  }
  func fun(param) {
    return;
  }
  `));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(interpreter.result()).toBe(null);
  });

test('60. Recursion test', () => {
  var lexer = new LexerImp(new StringReader(`
  func main() {
    param = 0;
    var = fun(param);
    return var;

  }
  func fun(param) {
    param = param + 1;
    if (param != 5) {
      return fun(param);
    }
    return param;
  }
  `));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(interpreter.result()).toBe(5);
  });

test('61. Alternation of object property in other object', () => {
  var lexer = new LexerImp(new StringReader(`
  func main() {
    color_var = Color(50, 50, 50, 50);
    pen = Pen(true, color_var);

    pen.color.r = 100;
    return color_var.r;
  }
  `));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(interpreter.result()).toBe(100);
  });

test('62. Compound division by zero', () => {
  var lexer = new LexerImp(new StringReader(`
  func main() {
    var = 5 / (100 + (200*0.1*(-1)) - 80)
    return var;
  }
  `));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();

    const exec = () => {
      program.accept(interpreter);
    };

    expect(exec).toThrow();
  });

test('63. Simple while loop', () => {
  var lexer = new LexerImp(new StringReader(`
  func main() {
    i = 0;
    while(i<5) {
      i = i+1;
    }
    return i;
  }
  `));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(interpreter.result()).toBe(5);
  });

test('64. Break in while loop', () => {
  var lexer = new LexerImp(new StringReader(`
  func main() {
    i = 0;
    while(i<5) {
      i = i+1;
      if (i==3) {
        break;
      }
    }
    return i;
  }
  `));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(interpreter.result()).toBe(3);
  });

test('65. Continue in while loop.', () => {
  var lexer = new LexerImp(new StringReader(`
  func main() {
    loop_num = 0;
    i = 0;
    while(i<5) {
      i = i+1;
      if (i==3) {
        continue
      }
      loop_num = loop_num+1;
    }
    return (i-1==loop_num);
  }
  `));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(interpreter.result()).toBe(true);
  });

test('66. Return in while loop', () => {
  var lexer = new LexerImp(new StringReader(`
  func main() {
    i = 0;
    while(i<5) {
      i = i+1;
      if (i==3) {
        return 100;
      }
    }
    return 0;
  }
  `));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(interpreter.result()).toBe(100);
  });

test('67. Statements after return are not executed.', () => {
  var lexer = new LexerImp(new StringReader(`
  func main() {
    var = 10
    return var;
    var = 20;
    return var;
  }
  `));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(interpreter.result()).toBe(10);
  });

test('68. Nested while loops', () => {
  var lexer = new LexerImp(new StringReader(`
  func main() {
    i = 0;
    inner_loop_count = 0;
    outer_loop_count = 0;
    while(i<5) {
      i = i+1;
      while(i<2) {
        i = i+0.1;
        inner_loop_count = inner_loop_count+1
      }
      outer_loop_count = outer_loop_count+1
    }
    return (inner_loop_count==10 && outer_loop_count==4);
  }
  `));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(interpreter.result()).toBe(true);
  });


test('69. Nested if statements', () => {
  var lexer = new LexerImp(new StringReader(`
  func main() {
    res = null;
    i = 0;
    if(i==0) {
      i = i+1;
      if(i==0) {
        res = 1000;
      } else {
        res = 2000;
      }
    }
    return res
  }
  `));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(interpreter.result()).toBe(2000);
  });

test('70. Accesing variables from previous scope', () => {
  var lexer = new LexerImp(new StringReader(`
  func main() {
    var = 5;
    res = 0;
    if(true) {
      res = var;
    }
    return res
  }
  `));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    expect(interpreter.result()).toBe(5);
  });

test('71. ERROR - Accessing local variable after leaving the scope', () => {
  var lexer = new LexerImp(new StringReader(`
  func main() {
    var = 5;
    if(true) {
      res = var;
    }
    return res
  }
  `));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    const exec = () => {
      program.accept(interpreter);
    };

    expect(exec).toThrow();
  });

test('72. ERROR - Accesing variable from previous function context.', () => {
  var lexer = new LexerImp(new StringReader(`
  func main() {
    var = 5;
    fun();
  }

  func fun() {
    loc_var = var;
  }
  `));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    const exec = () => {
      program.accept(interpreter);
    };

    expect(exec).toThrow();
  });

test('73. ERROR - Accesing variable after leaving function context', () => {
  var lexer = new LexerImp(new StringReader(`
  func main() {
    var = 5;
    fun();
    return loc_var;
  }

  func fun() {
    loc_var = var;
  }
  `));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    const exec = () => {
      program.accept(interpreter);
    };

    expect(exec).toThrow();
  });

test('74. ERROR - Redefinition of builtin function', () => {
  var lexer = new LexerImp(new StringReader(`
  func main() {
  }

  func print() {
  }
  `));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    const exec = () => {
      program.accept(interpreter);
    };

    expect(exec).toThrow();
  });

test('75. ERROR - Redefinition of builtin object constructor', () => {
  var lexer = new LexerImp(new StringReader(`
  func main() {
  }

  func Pen() {
  }
  `));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    const exec = () => {
      program.accept(interpreter);
    };

    expect(exec).toThrow();
  });

test('76. Short circuit OR operation', () => {
  var lexer = new LexerImp(new StringReader(`
  func main() {
    obj = Color(0, 0, 0, 0);
    if (fun_left(obj) || fun_right(obj)) {}
    return obj;
  }

  func fun_left(obj) {
    obj.a = 100;
    return true;
  }

  func fun_right(obj) {
    obj.r = 100;
    return true;
  }
  `));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    var res = <Color>(interpreter.result())

    expect(res.a).toBe(100);
    expect(res.r).not.toBe(100);
  });

test('77. Short circuit AND operation', () => {
  var lexer = new LexerImp(new StringReader(`
  func main() {
    obj = Color(0, 0, 0, 0);
    if (fun_left(obj) && fun_right(obj)) {}
    return obj;
  }

  func fun_left(obj) {
    obj.a = 100;
    return false;
  }

  func fun_right(obj) {
    obj.r = 100;
    return true;
  }
  `));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    var res = <Color>(interpreter.result())

    expect(res.a).toBe(100);
    expect(res.r).not.toBe(100);
  });

test('78. Non-Short circuit OR operation sideeffects', () => {
  var lexer = new LexerImp(new StringReader(`
  func main() {
    obj = Color(0, 0, 0, 0);
    if (fun_left(obj) || fun_right(obj)) {}
    return obj;
  }

  func fun_left(obj) {
    obj.a = 100;
    return false;
  }

  func fun_right(obj) {
    obj.r = 100;
    return true;
  }
  `));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    var res = <Color>(interpreter.result())

    expect(res.a).toBe(100);
    expect(res.r).toBe(100);
  });

test('79. Non-Short circuit AND operation sideeffects', () => {
  var lexer = new LexerImp(new StringReader(`
  func main() {
    obj = Color(0, 0, 0, 0);
    if (fun_left(obj) && fun_right(obj)) {}
    return obj;
  }

  func fun_left(obj) {
    obj.a = 100;
    return true;
  }

  func fun_right(obj) {
    obj.r = 100;
    return true;
  }
  `));
    var parser = new ParserImp(lexer);
    let program = parser.parse();
    var interpreter = new TestInterpreter();
    program.accept(interpreter);
    var res = <Color>(interpreter.result())

    expect(res.a).toBe(100);
    expect(res.r).toBe(100);
  });
});
