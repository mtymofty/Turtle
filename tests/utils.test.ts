import { is_letter, is_digit } from '../src/misc/Regex';
import { numeric_value } from '../src/misc/Math';

beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

describe('Utils tests:', () => {
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

});
