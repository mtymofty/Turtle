import { Evaluator } from "../src/interpreter/Evaluator";
import { Color } from "../src/interpreter/builtin/objs/Color";
import { Pen } from "../src/interpreter/builtin/objs/Pen";
import { Turtle } from "../src/interpreter/builtin/objs/Turte";
import { TurtlePosition } from "../src/interpreter/builtin/objs/TurtlePosition";
import { Position } from "../src/source/Position";

const mock_exit = jest.spyOn(process, 'exit')
            .mockImplementation((number) => { throw new Error('process.exit: ' + number); });

beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

describe('Evaluator tests:', () => {
  test('1. Addition evaluation - integer+integer', () => {
    expect(Evaluator.evaluateAdd(5, 5, new Position())).toBe(10);
  });

  test('2. Addition evaluation - integer+double', () => {
    expect(Evaluator.evaluateAdd(5, 5.5, new Position())).toBe(10.5);
  });

  test('3. Addition evaluation - double+integer', () => {
    expect(Evaluator.evaluateAdd(5.5, 5, new Position())).toBe(10.5);
  });

  test('4. Addition evaluation - double+double', () => {
    expect(Evaluator.evaluateAdd(5.5, 5.5, new Position())).toBe(11.0);
  });

  test('5. Addition evaluation - string+string', () => {
    expect(Evaluator.evaluateAdd("a", "b", new Position())).toBe("ab");
  });

  test('6. Addition evaluation OVERFLOW - (+)integer+integer', () => {
    expect(Evaluator.evaluateAdd(100**100, 100**100, new Position())).toBe(Number.MAX_SAFE_INTEGER);
  });

  test('7. Addition evaluation OVERFLOW - (-)integer+integer', () => {
    expect(Evaluator.evaluateAdd((-100)**99, (-100)**99, new Position())).toBe(-Number.MAX_SAFE_INTEGER);
  });

  test('8. Addition evaluation OVERFLOW - (+)double+double', () => {
    expect(Evaluator.evaluateAdd(123.45**100, 123.45**100, new Position())).toBe(Number.MAX_SAFE_INTEGER);
  });

  test('9. Addition evaluation OVERFLOW - (-)double+double', () => {
    expect(Evaluator.evaluateAdd((-123.45)**99, (-123.45)**99, new Position())).toBe(-Number.MAX_SAFE_INTEGER);
  });

  test('10. Subtraction evaluation - integer-integer', () => {
    expect(Evaluator.evaluateSubtr(5, 5, new Position())).toBe(0);
  });

  test('11. Subtraction evaluation - integer-double', () => {
    expect(Evaluator.evaluateSubtr(5, 5.5, new Position())).toBe(-0.5);
  });

  test('12. Subtraction evaluation - double-integer', () => {
    expect(Evaluator.evaluateSubtr(5.5, 5, new Position())).toBe(0.5);
  });

  test('13. Subtraction evaluation - double-double', () => {
    expect(Evaluator.evaluateSubtr(5.5, 5.5, new Position())).toBe(0.0);
  });

  test('14. Subtraction evaluation OVERFLOW - (+)integer-integer', () => {
    expect(Evaluator.evaluateSubtr(0, (-100)**99, new Position())).toBe(Number.MAX_SAFE_INTEGER);
  });

  test('15. Subtraction evaluation OVERFLOW - (-)integer-integer', () => {
    expect(Evaluator.evaluateSubtr(0, 100**100, new Position())).toBe(-Number.MAX_SAFE_INTEGER);
  });

  test('16. Subtraction evaluation OVERFLOW - (+)double-double', () => {
    expect(Evaluator.evaluateSubtr(0, (-123.45)**99, new Position())).toBe(Number.MAX_SAFE_INTEGER);
  });

  test('17. Subtraction evaluation OVERFLOW - (-)double-double', () => {
    expect(Evaluator.evaluateSubtr(0.0, 123.45**100, new Position())).toBe(-Number.MAX_SAFE_INTEGER);
  });

  test('18. Division evaluation - integer/integer', () => {
    expect(Evaluator.evaluateDiv(5, 5, new Position())).toBe(1);
  });

  test('19. Division evaluation - integer/double', () => {
    expect(Evaluator.evaluateDiv(5, 2.5, new Position())).toBe(2.0);
  });

  test('20. Division evaluation - double/integer', () => {
    expect(Evaluator.evaluateDiv(2.5, 5, new Position())).toBe(0.5);
  });

  test('21. Division evaluation - double/double', () => {
    expect(Evaluator.evaluateDiv(5.5, 5.5, new Position())).toBe(1.0);
  });

  test('22. Division evaluation OVERFLOW - (+)integer/integer', () => {
    expect(Evaluator.evaluateDiv(1, (1/100**100), new Position())).toBe(Number.MAX_SAFE_INTEGER);
  });

  test('23. Division evaluation OVERFLOW - (-)integer/integer', () => {
    expect(Evaluator.evaluateDiv(-1, (1/100**100), new Position())).toBe(-Number.MAX_SAFE_INTEGER);
  });

  test('24. Division evaluation OVERFLOW - (+)double/double', () => {
    expect(Evaluator.evaluateDiv(1.0, (1/100**100), new Position())).toBe(Number.MAX_SAFE_INTEGER);
  });

  test('25. Division evaluation OVERFLOW - (-)double/double', () => {
    expect(Evaluator.evaluateDiv(-1.0, (1/100**100), new Position())).toBe(-Number.MAX_SAFE_INTEGER);
  });

  test('26. Division BY ZERO', () => {
    const eval_ = () => {
        Evaluator.evaluateDiv(0.0, 0, new Position())
    };

    expect(eval_).toThrow();
  });

  test('27. Integer Division evaluation - integer//integer', () => {
    expect(Evaluator.evaluateIntDiv(5, 5, new Position())).toBe(1);
  });

  test('28. Integer Division evaluation - integer//double', () => {
    expect(Evaluator.evaluateIntDiv(5, 2.5, new Position())).toBe(2);
  });

  test('29. Integer Division evaluation - double//integer', () => {
    expect(Evaluator.evaluateIntDiv(2.5, 5, new Position())).toBe(0);
  });

  test('30. Integer Division evaluation - double//double', () => {
    expect(Evaluator.evaluateIntDiv(5.5, 5.5, new Position())).toBe(1);
  });

  test('31. Integer Division evaluation OVERFLOW - (+)integer//integer', () => {
    expect(Evaluator.evaluateIntDiv(1, (1/100**100), new Position())).toBe(Number.MAX_SAFE_INTEGER);
  });

  test('32. Integer Division evaluation OVERFLOW - (-)integer//integer', () => {
    expect(Evaluator.evaluateIntDiv(-1, (1/100**100), new Position())).toBe(-Number.MAX_SAFE_INTEGER);
  });

  test('33. Integer Division evaluation OVERFLOW - (+)double//double', () => {
    expect(Evaluator.evaluateIntDiv(1.0, (1/100**100), new Position())).toBe(Number.MAX_SAFE_INTEGER);
  });

  test('34. Integer Division evaluation OVERFLOW - (-)double//double', () => {
    expect(Evaluator.evaluateIntDiv(-1.0, (1/100**100), new Position())).toBe(-Number.MAX_SAFE_INTEGER);
  });

  test('35. Integer Division BY ZERO', () => {
    const eval_ = () => {
        Evaluator.evaluateIntDiv(0.0, 0, new Position())
    };

    expect(eval_).toThrow();
  });

  test('36. Modulo evaluation - integer%integer', () => {
    expect(Evaluator.evaluateModulo(4, 5, new Position())).toBe(4);
  });

  test('37. Modulo evaluation - integer%double', () => {
    expect(Evaluator.evaluateModulo(5, 2.5, new Position())).toBe(0);
  });

  test('38. Modulo evaluation - double%integer', () => {
    expect(Evaluator.evaluateModulo(2.5, 5, new Position())).toBe(2.5);
  });

  test('39. Modulo evaluation - double%double', () => {
    expect(Evaluator.evaluateModulo(5.5, 5.5, new Position())).toBe(0);
  });

  test('40. Modulo BY ZERO', () => {
    const eval_ = () => {
        Evaluator.evaluateModulo(0.0, 0, new Position())
    };

    expect(eval_).toThrow();
  });

  test('41. Multiplication evaluation - integer*integer', () => {
    expect(Evaluator.evaluateMult(5, 5, new Position())).toBe(25);
  });

  test('42. Multiplication evaluation - integer*double', () => {
    expect(Evaluator.evaluateMult(10, 2.5, new Position())).toBe(25.0);
  });

  test('43. Multiplication evaluation - double*integer', () => {
    expect(Evaluator.evaluateMult(2.5, 10, new Position())).toBe(25.0);
  });

  test('44. Multiplication evaluation - double*double', () => {
    expect(Evaluator.evaluateMult(5.5, 10.0, new Position())).toBe(55.0);
  });

  test('45. Multiplication evaluation OVERFLOW - (+)integer*integer', () => {
    expect(Evaluator.evaluateMult(1, 100**100, new Position())).toBe(Number.MAX_SAFE_INTEGER);
  });

  test('46. Multiplication evaluation OVERFLOW - (-)integer*integer', () => {
    expect(Evaluator.evaluateMult(-1, 100**100, new Position())).toBe(-Number.MAX_SAFE_INTEGER);
  });

  test('47. Multiplication evaluation OVERFLOW - (+)double*double', () => {
    expect(Evaluator.evaluateMult(1.0, 100**100, new Position())).toBe(Number.MAX_SAFE_INTEGER);
  });

  test('48. Multiplication evaluation OVERFLOW - (-)double*double', () => {
    expect(Evaluator.evaluateMult(-1.0, 100**100, new Position())).toBe(-Number.MAX_SAFE_INTEGER);
  });

  test('49. Exponentiation evaluation - integer^integer', () => {
    expect(Evaluator.evaluateExp(2, 5, new Position())).toBe(32);
  });

  test('50. Exponentiation evaluation - integer^double', () => {
    expect(Evaluator.evaluateExp(2, 2.5, new Position())).toBe(5.65685424949238);
  });

  test('51. Exponentiation evaluation - double^integer', () => {
    expect(Evaluator.evaluateExp(2.5, 5, new Position())).toBe(97.65625);
  });

  test('52. Exponentiation evaluation - double^double', () => {
    expect(Evaluator.evaluateExp(2.5, 5.5, new Position())).toBe(154.40808887540913);
  });

  test('53. Exponentiation evaluation OVERFLOW - (+)integer^integer', () => {
    expect(Evaluator.evaluateExp(2, 100, new Position())).toBe(Number.MAX_SAFE_INTEGER);
  });

  test('54. Exponentiation evaluation OVERFLOW - (-)integer^integer', () => {
    expect(Evaluator.evaluateExp(-2, 99, new Position())).toBe(-Number.MAX_SAFE_INTEGER);
  });

  test('55. Exponentiation evaluation OVERFLOW - (+)double^double', () => {
    expect(Evaluator.evaluateExp(2.0, 100, new Position())).toBe(Number.MAX_SAFE_INTEGER);
  });

  test('56. Exponentiation evaluation OVERFLOW - (-)double^double', () => {
    expect(Evaluator.evaluateExp(-2.0, 99, new Position())).toBe(-Number.MAX_SAFE_INTEGER);
  });

  test('57. Conjunction evaluation - integer && integer', () => {
    expect(Evaluator.evaluateAnd(2, 5)).toBe(true);
    expect(Evaluator.evaluateAnd(2, -5)).toBe(true);
    expect(Evaluator.evaluateAnd(2, 0)).toBe(false);
  });

  test('58. Conjunction evaluation - integer && double', () => {
    expect(Evaluator.evaluateAnd(2, 2.5)).toBe(true);
    expect(Evaluator.evaluateAnd(2, -2.5)).toBe(true);
    expect(Evaluator.evaluateAnd(2, 0.0)).toBe(false);
  });

  test('59. Conjunction evaluation - integer && boolean', () => {
    expect(Evaluator.evaluateAnd(2, true)).toBe(true);
    expect(Evaluator.evaluateAnd(2, false)).toBe(false);
  });

  test('60. Conjunction evaluation - integer && null', () => {
    expect(Evaluator.evaluateAnd(2, null)).toBe(false);
  });

  test('61. Conjunction evaluation - integer && string', () => {
    expect(Evaluator.evaluateAnd(2, "abc")).toBe(true);
    expect(Evaluator.evaluateAnd(2, "")).toBe(false);
  });

  test('62. Conjunction evaluation - integer && Color', () => {
    expect(Evaluator.evaluateAnd(2, new Color())).toBe(true);
  });

  test('63. Conjunction evaluation - integer && Turtle', () => {
    expect(Evaluator.evaluateAnd(2, new Turtle())).toBe(true);
  });

  test('64. Conjunction evaluation - integer && Pen', () => {
    expect(Evaluator.evaluateAnd(2, new Pen())).toBe(true);
  });

  test('65. Conjunction evaluation - integer && TurtlePosition', () => {
    expect(Evaluator.evaluateAnd(2, new TurtlePosition())).toBe(true);
  });

  test('66. Disjunction evaluation - integer || integer', () => {
    expect(Evaluator.evaluateOr(5, 5)).toBe(true);
    expect(Evaluator.evaluateOr(0, 5)).toBe(true);
    expect(Evaluator.evaluateOr(0, -5)).toBe(true);
    expect(Evaluator.evaluateOr(0, 0)).toBe(false);
  });

  test('67. Disjunction evaluation - integer || double', () => {
    expect(Evaluator.evaluateOr(0, 2.5)).toBe(true);
    expect(Evaluator.evaluateOr(0, -2.5)).toBe(true);
    expect(Evaluator.evaluateOr(0, 0.0)).toBe(false);
  });

  test('68. Disjunction evaluation - integer || boolean', () => {
    expect(Evaluator.evaluateOr(0, true)).toBe(true);
    expect(Evaluator.evaluateOr(0, false)).toBe(false);
  });

  test('69. Disjunction evaluation - integer || null', () => {
    expect(Evaluator.evaluateOr(0, null)).toBe(false);
  });

  test('70. Disjunction evaluation - integer || string', () => {
    expect(Evaluator.evaluateOr(0, "abc")).toBe(true);
    expect(Evaluator.evaluateOr(0, "")).toBe(false);
  });

  test('71. Disjunction evaluation - integer || Color', () => {
    expect(Evaluator.evaluateOr(0, new Color())).toBe(true);
  });

  test('72. Disjunction evaluation - integer || Turtle', () => {
    expect(Evaluator.evaluateOr(0, new Turtle())).toBe(true);
  });

  test('73. Disjunction evaluation - integer || Pen', () => {
    expect(Evaluator.evaluateOr(0, new Pen())).toBe(true);
  });

  test('74. Disjunction evaluation - integer || TurtlePosition', () => {
    expect(Evaluator.evaluateOr(0, new TurtlePosition())).toBe(true);
  });

  test('75. Negation evaluation - integer', () => {
    expect(Evaluator.evaluateNeg(4)).toBe(-4);
    expect(Evaluator.evaluateNeg(-4)).toBe(4);
  });

  test('76. Negation evaluation - double', () => {
    expect(Evaluator.evaluateNeg(5.5)).toBe(-5.5);
    expect(Evaluator.evaluateNeg(-5.5)).toBe(5.5);
  });

  test('77. Logical Negation evaluation - boolean', () => {
    expect(Evaluator.evaluateLogNeg(true)).toBe(false);
    expect(Evaluator.evaluateLogNeg(false)).toBe(true);
  });

  test('78. Equality evaluation - integer == integer', () => {
    expect(Evaluator.evaluateEq(5, 5)).toBe(true);
    expect(Evaluator.evaluateEq(10, 5)).toBe(false);
  });

  test('79. Equality evaluation - double == double', () => {
    expect(Evaluator.evaluateEq(5.5, 5.5)).toBe(true);
    expect(Evaluator.evaluateEq(10.5, 5.5)).toBe(false);
  });

  test('80. Equality evaluation - string == string', () => {
    expect(Evaluator.evaluateEq("abc", "abc")).toBe(true);
    expect(Evaluator.evaluateEq("---", "abc")).toBe(false);
  });

  test('81. Equality evaluation - boolean == boolean', () => {
    expect(Evaluator.evaluateEq(true, true)).toBe(true);
    expect(Evaluator.evaluateEq(false, true)).toBe(false);
  });

  test('81. Equality evaluation - boolean == boolean', () => {
    expect(Evaluator.evaluateEq(true, true)).toBe(true);
    expect(Evaluator.evaluateEq(false, true)).toBe(false);
  });

  test('82. Equality evaluation - Obj == Obj', () => {
    var pen = new Pen()
    var pen2 = new Pen()
    var pen3 = pen
    expect(Evaluator.evaluateEq(pen, pen3)).toBe(true);
    expect(Evaluator.evaluateEq(pen, pen2)).toBe(false);
  });

  test('83. Equality evaluation - integer == null', () => {
    expect(Evaluator.evaluateEq(5, null)).toBe(false);
  });

  test('84. Equality evaluation - null == null', () => {
    expect(Evaluator.evaluateEq(null, null)).toBe(true);
  });

  test('85. Non-Equality evaluation - integer != integer', () => {
    expect(Evaluator.evaluateNEq(5, 5)).toBe(false);
    expect(Evaluator.evaluateNEq(10, 5)).toBe(true);
  });

  test('86. Non-Equality evaluation - double != double', () => {
    expect(Evaluator.evaluateNEq(5.5, 5.5)).toBe(false);
    expect(Evaluator.evaluateNEq(10.5, 5.5)).toBe(true);
  });

  test('87. Non-Equality evaluation - string != string', () => {
    expect(Evaluator.evaluateNEq("abc", "abc")).toBe(false);
    expect(Evaluator.evaluateNEq("---", "abc")).toBe(true);
  });

  test('88. Non-Equality evaluation - boolean != boolean', () => {
    expect(Evaluator.evaluateNEq(true, true)).toBe(false);
    expect(Evaluator.evaluateNEq(false, true)).toBe(true);
  });

  test('89. Non-Equality evaluation - boolean != boolean', () => {
    expect(Evaluator.evaluateNEq(true, true)).toBe(false);
    expect(Evaluator.evaluateNEq(false, true)).toBe(true);
  });

  test('90. Non-Equality evaluation - Obj != Obj', () => {
    var pen = new Pen()
    var pen2 = new Pen()
    var pen3 = pen
    expect(Evaluator.evaluateNEq(pen, pen3)).toBe(false);
    expect(Evaluator.evaluateNEq(pen, pen2)).toBe(true);
  });

  test('91. Non-Equality evaluation - integer != null', () => {
    expect(Evaluator.evaluateNEq(5, null)).toBe(true);
  });

  test('92. Non-Equality evaluation - null != null', () => {
    expect(Evaluator.evaluateNEq(null, null)).toBe(false);
  });

  test('93. Comparison evaluation - integer ? integer', () => {
    expect(Evaluator.evaluateLEq(4, 5)).toBe(true);
    expect(Evaluator.evaluateLEq(5, 5)).toBe(true);
    expect(Evaluator.evaluateLEq(6, 5)).toBe(false);

    expect(Evaluator.evaluateGEq(4, 5)).toBe(false);
    expect(Evaluator.evaluateGEq(5, 5)).toBe(true);
    expect(Evaluator.evaluateGEq(6, 5)).toBe(true);

    expect(Evaluator.evaluateLess(4, 5)).toBe(true);
    expect(Evaluator.evaluateLess(5, 5)).toBe(false);
    expect(Evaluator.evaluateLess(6, 5)).toBe(false);

    expect(Evaluator.evaluateGrt(4, 5)).toBe(false);
    expect(Evaluator.evaluateGrt(5, 5)).toBe(false);
    expect(Evaluator.evaluateGrt(6, 5)).toBe(true);
  });

  test('94. Comparison evaluation - double ? double', () => {
    expect(Evaluator.evaluateLEq(4.5, 5.5)).toBe(true);
    expect(Evaluator.evaluateLEq(5.5, 5.5)).toBe(true);
    expect(Evaluator.evaluateLEq(6.5, 5.5)).toBe(false);

    expect(Evaluator.evaluateGEq(4.5, 5.5)).toBe(false);
    expect(Evaluator.evaluateGEq(5.5, 5.5)).toBe(true);
    expect(Evaluator.evaluateGEq(6.5, 5.5)).toBe(true);

    expect(Evaluator.evaluateLess(4.5, 5.5)).toBe(true);
    expect(Evaluator.evaluateLess(5.5, 5.5)).toBe(false);
    expect(Evaluator.evaluateLess(6.5, 5.5)).toBe(false);

    expect(Evaluator.evaluateGrt(4.5, 5.5)).toBe(false);
    expect(Evaluator.evaluateGrt(5.5, 5.5)).toBe(false);
    expect(Evaluator.evaluateGrt(6.5, 5.5)).toBe(true);
  });

  test('95. Comparison evaluation - integer ? double', () => {
    expect(Evaluator.evaluateLEq(4, 5.5)).toBe(true);
    expect(Evaluator.evaluateLEq(5, 5.0)).toBe(true);
    expect(Evaluator.evaluateLEq(6, 5.5)).toBe(false);

    expect(Evaluator.evaluateGEq(4, 5.5)).toBe(false);
    expect(Evaluator.evaluateGEq(5, 5.0)).toBe(true);
    expect(Evaluator.evaluateGEq(6, 5.5)).toBe(true);

    expect(Evaluator.evaluateLess(4, 5.5)).toBe(true);
    expect(Evaluator.evaluateLess(5, 5.0)).toBe(false);
    expect(Evaluator.evaluateLess(6, 5.5)).toBe(false);

    expect(Evaluator.evaluateGrt(4, 5.5)).toBe(false);
    expect(Evaluator.evaluateGrt(5, 5.0)).toBe(false);
    expect(Evaluator.evaluateGrt(6, 5.5)).toBe(true);
  });
});