import { TypeMatching } from "../src/interpreter/TypeMatching";
import { Color } from "../src/interpreter/builtin/objs/Color";
import { Pen } from "../src/interpreter/builtin/objs/Pen";
import { Turtle } from "../src/interpreter/builtin/objs/Turte";
import { TurtlePosition } from "../src/interpreter/builtin/objs/TurtlePosition";
import { Value } from "../src/interpreter/semantics/Value";
import { Position } from "../src/source/Position";

const mock_exit = jest.spyOn(process, 'exit')
            .mockImplementation((number) => { throw new Error('process.exit: ' + number); });

beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

describe('Type matching tests:', () => {
  test('1. Two integers addition succesful match', () => {
    expect(TypeMatching.matchesAdd(5, 10)).toBe(true);
    expect(TypeMatching.matchesAdd(-5, -10)).toBe(true);
    expect(TypeMatching.matchesAdd(0, 0)).toBe(true);
  });

  test('2. Two doubles addition succesful match', () => {
    expect(TypeMatching.matchesAdd(5.5, 10.0)).toBe(true);
    expect(TypeMatching.matchesAdd(-5.0, -10.0)).toBe(true);
    expect(TypeMatching.matchesAdd(0.0, 0.0)).toBe(true);
  });

  test('3. Integer and double addition succesful match', () => {
    expect(TypeMatching.matchesAdd(5.5, 10)).toBe(true);
    expect(TypeMatching.matchesAdd(-5.0, -10)).toBe(true);
    expect(TypeMatching.matchesAdd(0.0, 0)).toBe(true);
  });

  test('4. Two strings addition succesful match', () => {
    expect(TypeMatching.matchesAdd("", "")).toBe(true);
    expect(TypeMatching.matchesAdd("abc", "def")).toBe(true);
  });

  test('5. Invalid same types addition does not match', () => {
    expect(TypeMatching.matchesAdd(true, false)).toBe(false);
    expect(TypeMatching.matchesAdd(null, null)).toBe(false);
    expect(TypeMatching.matchesAdd(new Color(), new Color())).toBe(false);
  });

  test('6. Illigal mix of valid types addition does not match', () => {
    expect(TypeMatching.matchesAdd(5, "abc")).toBe(false);
    expect(TypeMatching.matchesAdd(5.5, "abc")).toBe(false);
  });

  test('7. Two integers (non)equality succesful match', () => {
    expect(TypeMatching.matchesEq(5, 10)).toBe(true);
    expect(TypeMatching.matchesEq(-5, -10)).toBe(true);
    expect(TypeMatching.matchesEq(0, 0)).toBe(true);
  });

  test('8. Two doubles (non)equality succesful match', () => {
    expect(TypeMatching.matchesEq(5.5, 10.5)).toBe(true);
    expect(TypeMatching.matchesEq(-5.5, -10.5)).toBe(true);
    expect(TypeMatching.matchesEq(0.0, 0.0)).toBe(true);
  });

  test('9. Two strings (non)equality succesful match', () => {
    expect(TypeMatching.matchesEq("", "")).toBe(true);
    expect(TypeMatching.matchesEq("abc", "def")).toBe(true);
  });

  test('10. Two boolean (non)equality succesful match', () => {
    expect(TypeMatching.matchesEq(true, false)).toBe(true);
  });

  test('11. Two objects (non)equality succesful match', () => {
    expect(TypeMatching.matchesEq(new Color(), new Color())).toBe(true);
  });

  test('12. Null (non)equality succesful match', () => {
    expect(TypeMatching.matchesEq(5, null)).toBe(true);
    expect(TypeMatching.matchesEq(5.5, null)).toBe(true);
    expect(TypeMatching.matchesEq("abc", null)).toBe(true);
    expect(TypeMatching.matchesEq(true, null)).toBe(true);
    expect(TypeMatching.matchesEq(null, null)).toBe(true);
    expect(TypeMatching.matchesEq(new Color(), null)).toBe(true);
  });

  test('13. Two different types (non)equality does not match', () => {
    expect(TypeMatching.matchesEq(5, "abc")).toBe(false);
    expect(TypeMatching.matchesEq(5.5, "abc")).toBe(false);
    expect(TypeMatching.matchesEq(true, "abc")).toBe(false);
    expect(TypeMatching.matchesEq(new Color(), "abc")).toBe(false);
  });

  test('14. Two integers comparison succesful match', () => {
    expect(TypeMatching.matchesComp(5, 10)).toBe(true);
    expect(TypeMatching.matchesComp(-5, -10)).toBe(true);
    expect(TypeMatching.matchesComp(0, 0)).toBe(true);
  });

  test('15. Two doubles comparison succesful match', () => {
    expect(TypeMatching.matchesComp(5.5, 10.5)).toBe(true);
    expect(TypeMatching.matchesComp(-5.5, -10.5)).toBe(true);
    expect(TypeMatching.matchesComp(0.0, 0.0)).toBe(true);
  });

  test('16. Invalid types comparison does not match', () => {
    expect(TypeMatching.matchesComp("abc", 5)).toBe(false);
    expect(TypeMatching.matchesComp(true, 5)).toBe(false);
    expect(TypeMatching.matchesComp(null, 5)).toBe(false);
    expect(TypeMatching.matchesComp(new Color(), 5)).toBe(false);
  });

  test('17. Integer negation succesful match', () => {
    expect(TypeMatching.matchesNeg(5)).toBe(true);
    expect(TypeMatching.matchesNeg(-5)).toBe(true);
    expect(TypeMatching.matchesNeg(0)).toBe(true);
  });

  test('18. Double negation succesful match', () => {
    expect(TypeMatching.matchesNeg(5.5)).toBe(true);
    expect(TypeMatching.matchesNeg(-5.5)).toBe(true);
    expect(TypeMatching.matchesNeg(0.0)).toBe(true);
  });

  test('19. Invalid type negation does not match', () => {
    expect(TypeMatching.matchesNeg("abc")).toBe(false);
    expect(TypeMatching.matchesNeg(true)).toBe(false);
    expect(TypeMatching.matchesNeg(new Color())).toBe(false);
  });

  test('20. Two booleans logical negation succesful match', () => {
    expect(TypeMatching.matchesLogNeg(true)).toBe(true);
    expect(TypeMatching.matchesLogNeg(false)).toBe(true);
  });

  test('21. Invalid type logical negation does not match', () => {
    expect(TypeMatching.matchesLogNeg("abc")).toBe(false);
    expect(TypeMatching.matchesLogNeg(5)).toBe(false);
    expect(TypeMatching.matchesLogNeg(5.5)).toBe(false);
    expect(TypeMatching.matchesLogNeg(new Color())).toBe(false);
  });

  test('22. Logical operators always matches succesfully', () => {
    expect(TypeMatching.matchesLog(5, 5)).toBe(true);
    expect(TypeMatching.matchesLog(5.5, 5)).toBe(true);
    expect(TypeMatching.matchesLog("abc", 5)).toBe(true);
    expect(TypeMatching.matchesLog(true, 5)).toBe(true);
    expect(TypeMatching.matchesLog(null, 5)).toBe(true);
    expect(TypeMatching.matchesLog(new Color(), 5)).toBe(true);
  });

  test('23. Get type of integer should return correct type', () => {
    expect(TypeMatching.getTypeOf(5)).toBe("integer");
  });

  test('24. Get type of double should return correct type', () => {
    expect(TypeMatching.getTypeOf(5.5)).toBe("double");
  });

  test('25. Get type of string should return correct type', () => {
    expect(TypeMatching.getTypeOf(" ")).toBe("string");
  });

  test('26. Get type of null should return correct type', () => {
    expect(TypeMatching.getTypeOf(null)).toBe("null");
  });

  test('27. Get type of boolean should return correct type', () => {
    expect(TypeMatching.getTypeOf(true)).toBe("boolean");
  });

  test('28. Get type of Color should return correct type', () => {
    expect(TypeMatching.getTypeOf(new Color())).toBe("Color");
  });

  test('29. Get type of Pen should return correct type', () => {
    expect(TypeMatching.getTypeOf(new Pen())).toBe("Pen");
  });

  test('30. Get type of TurtlePosition should return correct type', () => {
    expect(TypeMatching.getTypeOf(new TurtlePosition())).toBe("TurtlePosition");
  });

  test('31. Get type of Turtle should return correct type', () => {
    expect(TypeMatching.getTypeOf(new Turtle())).toBe("Turtle");
  });

  test('32. Checking types compatibility - empty', () => {
    const match = () => {
      TypeMatching.checkTypes([], [], null)
    };

  expect(match).not.toThrow();

  });

  test('33. Checking types compatibility - integer-integer', () => {
    const match = () => {
      TypeMatching.checkTypes([new Value(5)], ["integer"], new Position())
    };

  expect(match).not.toThrow();

  });

  test('34. Checking types compatibility - integer-number', () => {
    const match = () => {
      TypeMatching.checkTypes([new Value(5)], ["number"], new Position())
    };

  expect(match).not.toThrow();

  });

  test('35. Checking types compatibility - double-double', () => {
    const match = () => {
      TypeMatching.checkTypes([new Value(5.5)], ["double"], new Position())
    };

  expect(match).not.toThrow();

  });

  test('36. Checking types compatibility - double-number', () => {
    const match = () => {
      TypeMatching.checkTypes([new Value(5.5)], ["number"], new Position())
    };

  expect(match).not.toThrow();

  });

  test('37. Checking types compatibility - string-string', () => {
    const match = () => {
      TypeMatching.checkTypes([new Value("abc")], ["string"], new Position())
    };

  expect(match).not.toThrow();

  });

  test('38. Checking types compatibility - boolean-boolean', () => {
    const match = () => {
      TypeMatching.checkTypes([new Value(true)], ["boolean"], new Position())
    };

  expect(match).not.toThrow();

  });

  test('39. Checking types compatibility - null-null', () => {
    const match = () => {
      TypeMatching.checkTypes([new Value(null)], ["null"], new Position())
    };

  expect(match).not.toThrow();

  });

  test('40. Checking types compatibility - Color-Color', () => {
    const match = () => {
      TypeMatching.checkTypes([new Value(new Color())], ["Color"], new Position())
    };

  expect(match).not.toThrow();

  });

  test('41. Checking types compatibility - Turtle-Turtle', () => {
    const match = () => {
      TypeMatching.checkTypes([new Value(new Turtle())], ["Turtle"], new Position())
    };

  expect(match).not.toThrow();
  });

  test('42. Checking types compatibility - TurtlePosition-TurtlePosition', () => {
    const match = () => {
      TypeMatching.checkTypes([new Value(new TurtlePosition())], ["TurtlePosition"], new Position())
    };

  expect(match).not.toThrow();
  });

  test('43. Checking types compatibility - Pen-Pen', () => {
    const match = () => {
      TypeMatching.checkTypes([new Value(new Pen())], ["Pen"], new Position())
    };

  expect(match).not.toThrow();
  });

  test('44. Checking types compatibility (INVALID) - boolean-integer', () => {
    const match = () => {
      TypeMatching.checkTypes([new Value(true)], ["integer"], new Position())
    };

  expect(match).toThrow();
  });

  test('45. Checking multiple types compatibility - [boolean, integer]-[boolean, integer]', () => {
    const match = () => {
      TypeMatching.checkTypes([new Value(true), new Value(5)], ["boolean", "integer"], new Position())
    };

  expect(match).not.toThrow();
  });

  test('46. Checking multiple types compatibility (INVALID) - [boolean, boolean]-[boolean, integer]', () => {
    const match = () => {
      TypeMatching.checkTypes([new Value(true), new Value(true)], ["boolean", "integer"], new Position())
    };

  expect(match).toThrow();
  });

  test('47. Checking assignment types compatibility - integer-integer', () => {
    const match = () => {
      TypeMatching.checkAssignType(5, "integer", "_", new Position())
    };

  expect(match).not.toThrow();
  });

  test('48. Checking assignment types compatibility - integer-number', () => {
    const match = () => {
      TypeMatching.checkAssignType(5, "number", "_", new Position())
    };

  expect(match).not.toThrow();
  });

  test('49. Checking assignment types compatibility - double-double', () => {
    const match = () => {
      TypeMatching.checkAssignType(5.5, "double", "_", new Position())
    };

  expect(match).not.toThrow();
  });

  test('50. Checking assignment types compatibility - double-number', () => {
    const match = () => {
      TypeMatching.checkAssignType(5.5, "number", "_", new Position())
    };

  expect(match).not.toThrow();
  });

  test('51. Checking assignment types compatibility - string-string', () => {
    const match = () => {
      TypeMatching.checkAssignType("abc", "string", "_", new Position())
    };

  expect(match).not.toThrow();
  });

  test('52. Checking assignment types compatibility - boolean-boolean', () => {
    const match = () => {
      TypeMatching.checkAssignType(true, "boolean", "_", new Position())
    };

  expect(match).not.toThrow();
  });

  test('53. Checking assignment types compatibility - null-null', () => {
    const match = () => {
      TypeMatching.checkAssignType(null, "null", "_", new Position())
    };

  expect(match).not.toThrow();
  });

  test('54. Checking assignment types compatibility - Color-Color', () => {
    const match = () => {
      TypeMatching.checkAssignType(new Color(), "Color", "_", new Position())
    };

  expect(match).not.toThrow();
  });

  test('55. Checking assignment types compatibility - Turtle-Turtle', () => {
    const match = () => {
      TypeMatching.checkAssignType(new Turtle(), "Turtle", "_", new Position())
    };

  expect(match).not.toThrow();
  });

  test('56. Checking assignment types compatibility - TurtlePosition-TurtlePosition', () => {
    const match = () => {
      TypeMatching.checkAssignType(new TurtlePosition(), "TurtlePosition", "_", new Position())
    };

  expect(match).not.toThrow();
  });

  test('57. Checking assignment types compatibility - Pen-Pen', () => {
    const match = () => {
      TypeMatching.checkAssignType(new Pen(), "Pen", "_", new Position())
    };

  expect(match).not.toThrow();
  });

  test('58. Checking assignment types compatibility (INVALID) - boolean-integer', () => {
    const match = () => {
      TypeMatching.checkAssignType(true, "integer", "_", new Position())
    };

  expect(match).toThrow();
  expect(mock_exit).toHaveBeenCalledWith(1);
  });

  test('59. Is object instance - primitives - should me false', () => {
    expect(TypeMatching.isObjectInstance(" ")).toBe(false);
    expect(TypeMatching.isObjectInstance(5)).toBe(false);
    expect(TypeMatching.isObjectInstance(5.5)).toBe(false);
    expect(TypeMatching.isObjectInstance(true)).toBe(false);
    expect(TypeMatching.isObjectInstance(null)).toBe(false);
  });

  test('60. Is object instance - Color - should me true', () => {
    expect(TypeMatching.isObjectInstance(new Color())).toBe(true);
  });

  test('61. Is object instance - Pen - should me true', () => {
    expect(TypeMatching.isObjectInstance(new Pen())).toBe(true);
  });

  test('62. Is object instance - Turtle - should me true', () => {
    expect(TypeMatching.isObjectInstance(new Turtle())).toBe(true);
  });

  test('63. Is object instance - TurtlePosition - should me true', () => {
    expect(TypeMatching.isObjectInstance(new TurtlePosition())).toBe(true);
  });

  test('64. Getting number type - integer, integer', () => {
    expect(TypeMatching.numType(5, 5)).toBe("integer");
  });

  test('65. Getting number type - double, integer', () => {
    expect(TypeMatching.numType(5.5, 5)).toBe("double");
  });

  test('66. Getting number type - double, double', () => {
    expect(TypeMatching.numType(5.5, 5.5)).toBe("double");
  });
});
