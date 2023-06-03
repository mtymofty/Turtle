import { Evaluator } from "../src/interpreter/Evaluator";
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
    expect(Evaluator.evaluateAdd(123.45**100, 123.45**100, new Position())).toBe(Number.MAX_SAFE_INTEGER * 1.0);
  });

  test('9. Addition evaluation OVERFLOW - (-)double+double', () => {
    expect(Evaluator.evaluateAdd((-123.45)**99, (-123.45)**99, new Position())).toBe(-Number.MAX_SAFE_INTEGER * 1.0);
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
    expect(Evaluator.evaluateSubtr(0, (-123.45)**99, new Position())).toBe(Number.MAX_SAFE_INTEGER * 1.0);
  });

  test('17. Subtraction evaluation OVERFLOW - (-)double-double', () => {
    expect(Evaluator.evaluateSubtr(0.0, 123.45**100, new Position())).toBe(-Number.MAX_SAFE_INTEGER * 1.0);
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
    expect(Evaluator.evaluateDiv(1.0, (1/100**100), new Position())).toBe(Number.MAX_SAFE_INTEGER * 1.0);
  });

  test('25. Division evaluation OVERFLOW - (-)double/double', () => {
    expect(Evaluator.evaluateDiv(-1.0, (1/100**100), new Position())).toBe(-Number.MAX_SAFE_INTEGER * 1.0);
  });

  test('26. Division BY ZERO', () => {
    const eval_ = () => {
        Evaluator.evaluateDiv(0.0, 0, new Position())
    };

    expect(eval_).toThrow();
  });

  test('27. Integer Division evaluation - integer/integer', () => {
    expect(Evaluator.evaluateIntDiv(5, 5, new Position())).toBe(1);
  });

  test('28. Integer Division evaluation - integer/double', () => {
    expect(Evaluator.evaluateIntDiv(5, 2.5, new Position())).toBe(2);
  });

  test('29. Integer Division evaluation - double/integer', () => {
    expect(Evaluator.evaluateIntDiv(2.5, 5, new Position())).toBe(0);
  });

  test('30. Integer Division evaluation - double/double', () => {
    expect(Evaluator.evaluateIntDiv(5.5, 5.5, new Position())).toBe(1);
  });

  test('31. Integer Division evaluation OVERFLOW - (+)integer/integer', () => {
    expect(Evaluator.evaluateIntDiv(1, (1/100**100), new Position())).toBe(Number.MAX_SAFE_INTEGER);
  });

  test('32. Integer Division evaluation OVERFLOW - (-)integer/integer', () => {
    expect(Evaluator.evaluateIntDiv(-1, (1/100**100), new Position())).toBe(-Number.MAX_SAFE_INTEGER);
  });

  test('33. Integer Division evaluation OVERFLOW - (+)double/double', () => {
    expect(Evaluator.evaluateIntDiv(1.0, (1/100**100), new Position())).toBe(Number.MAX_SAFE_INTEGER);
  });

  test('34. Integer Division evaluation OVERFLOW - (-)double/double', () => {
    expect(Evaluator.evaluateIntDiv(-1.0, (1/100**100), new Position())).toBe(-Number.MAX_SAFE_INTEGER);
  });

  test('35. Integer Division BY ZERO', () => {
    const eval_ = () => {
        Evaluator.evaluateIntDiv(0.0, 0, new Position())
    };

    expect(eval_).toThrow();
  });

  test('36. Modulo evaluation - integer/integer', () => {
    expect(Evaluator.evaluateModulo(4, 5, new Position())).toBe(4);
  });

  test('37. Modulo evaluation - integer/double', () => {
    expect(Evaluator.evaluateModulo(5, 2.5, new Position())).toBe(0);
  });

  test('38. Modulo evaluation - double/integer', () => {
    expect(Evaluator.evaluateModulo(2.5, 5, new Position())).toBe(2.5);
  });

  test('39. Modulo evaluation - double/double', () => {
    expect(Evaluator.evaluateModulo(5.5, 5.5, new Position())).toBe(0);
  });

  test('40. Modulo BY ZERO', () => {
    const eval_ = () => {
        Evaluator.evaluateModulo(0.0, 0, new Position())
    };

    expect(eval_).toThrow();
  });

});