import { Color } from "../src/interpreter/builtin/objs/Color";
import { Pen } from "../src/interpreter/builtin/objs/Pen";
import { Turtle } from "../src/interpreter/builtin/objs/Turte";
import { TurtlePosition } from "../src/interpreter/builtin/objs/TurtlePosition";
import { Value } from "../src/interpreter/semantics/Value";

beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

describe('Value.getPrintable tests:', () => {
  test('1. Printable of integer', () => {
    expect(Value.getPrintable(5)).toBe("5");
    expect(Value.getPrintable(0)).toBe("0");
    expect(Value.getPrintable(-5)).toBe("-5");
  });

  test('2. Printable of double', () => {
    expect(Value.getPrintable(5.5)).toBe("5.5");
    expect(Value.getPrintable(0.5)).toBe("0.5");
    expect(Value.getPrintable(-5.5)).toBe("-5.5");
  });

  test('3. Printable of boolean', () => {
    expect(Value.getPrintable(true)).toBe("true");
    expect(Value.getPrintable(false)).toBe("false");
  });

  test('4. Printable of null', () => {
    expect(Value.getPrintable(null)).toBe("null");
  });

  test('5. Printable of string', () => {
    expect(Value.getPrintable("abc")).toBe("abc");
  });

  test('6. Printable of simple object', () => {
    let obj = new Color(100, 5, 10, 15)
    let expected = "" +
    "Color {\n" +
    "  a: 100\n" +
    "  r: 5\n" +
    "  g: 10\n" +
    "  b: 15\n" +
    "}\n"
    expect(Value.getPrintable(obj)).toBe(expected);
  });

  test('7. Printable of compound object', () => {
    let obj = new Turtle(new Pen(), new TurtlePosition(), 100)
    let expected = "" +
    "Turtle {\n" +
    "  pen: Pen\n" +
    "  position: TurtlePosition\n" +
    "  angle: 100\n" +
    "}\n"
    expect(Value.getPrintable(obj)).toBe(expected);
  });
});