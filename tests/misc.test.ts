import { is_letter, is_digit } from '../src/misc/Regex';
import { numeric_value } from '../src/misc/Math';
import { find_occurances, insert, printable } from '../src/misc/String';

beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

describe('Misc tests:', () => {
  test('is_letter regex matches latin letters', () => {
    expect(is_letter.test('a')).toBe(true);
    expect(is_letter.test('A')).toBe(true);
  });

  test('is_letter regex matches non-latin letters', () => {
    expect(is_letter.test('日')).toBe(true);
  });

  test('is_letter regex does not match non-letters', () => {
    expect(is_letter.test('1')).toBe(false);
    expect(is_letter.test('!')).toBe(false);
    expect(is_letter.test('-')).toBe(false);
    expect(is_letter.test('_')).toBe(false);
    expect(is_letter.test('\n')).toBe(false);
  });

  test('is_letter regex does not match multi-letter strings', () => {
    expect(is_letter.test('bB')).toBe(false);
    expect(is_letter.test('яп')).toBe(false);
  });

  test('is_letter regex does not match empty string', () => {
    expect(is_letter.test('')).toBe(false);
  });

  test('is_digit regex matches single-digit numbers', () => {
    expect(is_digit.test('0')).toBe(true);
    expect(is_digit.test('1')).toBe(true);
  });

  test('is_digit regex does not match non-digits', () => {
    expect(is_digit.test('a')).toBe(false);
    expect(is_digit.test('!')).toBe(false);
    expect(is_digit.test('-')).toBe(false);
    expect(is_digit.test('_')).toBe(false);
    expect(is_digit.test('\n')).toBe(false);
  });

  test('is_digit regex does not match empty string', () => {
    expect(is_digit.test('')).toBe(false);
  });

  test('is_digit regex does not match multi-digit numbers', () => {
    expect(is_digit.test('01')).toBe(false);
  });

  test('numeric_value of a string should return correct value', () => {
    expect(numeric_value("0")).toBe(0);
    expect(numeric_value("5")).toBe(5);
  });

  test('String "aaa" should contain 3 occurances of char "a"', () => {
    expect(find_occurances("a", "aaa").length).toBe(3);
  });

  test('String "aaa" should contain 0 occurances of char "b"', () => {
    expect(find_occurances("b", "aaa").length).toBe(0);
  });

  test('String "" should contain 0 occurances of ""', () => {
    expect(find_occurances("", "").length).toBe(0);
  });

  test('Insertion of "a" into "" at index 0, should generate string "a"', () => {
    expect(insert("", 0, "a")).toBe("a");
  });

  test('Insertion of "b" into "a" at index 1, should generate string "ab"', () => {
    expect(insert("a", 1, "b")).toBe("ab");
  });

  test('Insertion of "bb" into "a_ccc" at index 1, should generate string "abc"', () => {
    expect(insert("a_ccc", 1, "bb")).toBe("abbccc");
  });

  test('Printable version of "a" should be equal "a"', () => {
    expect(printable("a")).toBe("a");
  });

  test('Printable version of newline (\\n) should be equal "\\n"', () => {
    expect(printable("\n")).toBe("\\n");
  });

  test('Printable version of escaped char (\\t) should be equal "\\t"', () => {
    expect(printable("\t")).toBe("\\t");
  });
});
