import { Lexer } from '../src/lexer/Lexer';
import { StringReader } from '../src/source/Reader';
import { Token } from '../src/token/Token';
import { TokenType } from '../src/token/TokenType';

beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

describe('Lexer class tests:', () => {
  test('Empty string should return TokenType.EOF', () => {
    var lexer = new Lexer(new StringReader(""))
    expect(lexer.next_token().type).toBe(TokenType.EOF);
  });

  test('"=" should return TokenType.ASSIGN_OP', () => {
    var lexer = new Lexer(new StringReader("="))
    expect(lexer.next_token().type).toBe(TokenType.ASSIGN_OP);
  });

  test('"+" should return TokenType.ADD_OP', () => {
    var lexer = new Lexer(new StringReader("+"))
    expect(lexer.next_token().type).toBe(TokenType.ADD_OP);
  });

  test('"*" should return TokenType.MULT_OP', () => {
    var lexer = new Lexer(new StringReader("*"))
    expect(lexer.next_token().type).toBe(TokenType.MULT_OP);
  });

  test('"/" should return TokenType.DIV_OP', () => {
    var lexer = new Lexer(new StringReader("/"))
    expect(lexer.next_token().type).toBe(TokenType.DIV_OP);
  });

  test('"//" should return TokenType.DIV_INT_OP', () => {
    var lexer = new Lexer(new StringReader("//"))
    expect(lexer.next_token().type).toBe(TokenType.DIV_INT_OP);
  });

  test('"^" should return TokenType.POW_OP', () => {
    var lexer = new Lexer(new StringReader("^"))
    expect(lexer.next_token().type).toBe(TokenType.POW_OP);
  });

  test('"%" should return TokenType.MOD_OP', () => {
    var lexer = new Lexer(new StringReader("%"))
    expect(lexer.next_token().type).toBe(TokenType.MOD_OP);
  });

  test('"==" should return TokenType.EQ_OP', () => {
    var lexer = new Lexer(new StringReader("=="))
    expect(lexer.next_token().type).toBe(TokenType.EQ_OP);
  });

  test('"!=" should return TokenType.NEQ_OP', () => {
    var lexer = new Lexer(new StringReader("!="))
    expect(lexer.next_token().type).toBe(TokenType.NEQ_OP);
  });

  test('">" should return TokenType.GRT_OP', () => {
    var lexer = new Lexer(new StringReader(">"))
    expect(lexer.next_token().type).toBe(TokenType.GRT_OP);
  });

  test('">=" should return TokenType.GRT_EQ_OP', () => {
    var lexer = new Lexer(new StringReader(">="))
    expect(lexer.next_token().type).toBe(TokenType.GRT_EQ_OP);
  });

  test('"<" should return TokenType.LESS_OP', () => {
    var lexer = new Lexer(new StringReader("<"))
    expect(lexer.next_token().type).toBe(TokenType.LESS_OP);
  });

  test('"<=" should return TokenType.LESS_EQ_OP', () => {
    var lexer = new Lexer(new StringReader("<="))
    expect(lexer.next_token().type).toBe(TokenType.LESS_EQ_OP);
  });

  test('"&&" should return TokenType.AND_OP', () => {
    var lexer = new Lexer(new StringReader("&&"))
    expect(lexer.next_token().type).toBe(TokenType.AND_OP);
  });

  test('"||" should return TokenType.OR_OP', () => {
    var lexer = new Lexer(new StringReader("||"))
    expect(lexer.next_token().type).toBe(TokenType.OR_OP);
  });

  test('"!" should return TokenType.NOT_OP', () => {
    var lexer = new Lexer(new StringReader("!"))
    expect(lexer.next_token().type).toBe(TokenType.NOT_OP);
  });

  test('"-" should return TokenType.MINUS_OP', () => {
    var lexer = new Lexer(new StringReader("-"))
    expect(lexer.next_token().type).toBe(TokenType.MINUS_OP);
  });

  test('"." should return TokenType.DOT_OP', () => {
    var lexer = new Lexer(new StringReader("."))
    expect(lexer.next_token().type).toBe(TokenType.DOT_OP);
  });

  test('"(" should return TokenType.L_BRACE_OP', () => {
    var lexer = new Lexer(new StringReader("(=)"))
    expect(lexer.next_token().type).toBe(TokenType.L_BRACE_OP);
  });

  test('"{" should return TokenType.L_C_BRACE_OP', () => {
    var lexer = new Lexer(new StringReader("{"))
    expect(lexer.next_token().type).toBe(TokenType.L_C_BRACE_OP);
  });

  test('")" should return TokenType.R_BRACE_OP', () => {
    var lexer = new Lexer(new StringReader(")"))
    expect(lexer.next_token().type).toBe(TokenType.R_BRACE_OP);
  });

  test('"}" should return TokenType.R_C_BRACE_OP', () => {
    var lexer = new Lexer(new StringReader("}"))
    expect(lexer.next_token().type).toBe(TokenType.R_C_BRACE_OP);
  });

  test('"," should return TokenType.COMMA_OP', () => {
    var lexer = new Lexer(new StringReader(","))
    expect(lexer.next_token().type).toBe(TokenType.COMMA_OP);
  });

  test('";" should return TokenType.TERMINATOR', () => {
    var lexer = new Lexer(new StringReader(";"))
    expect(lexer.next_token().type).toBe(TokenType.TERMINATOR);
  });

  test('"0" should return TokenType.INTEGER with value=0', () => {
    var lexer = new Lexer(new StringReader("0"))
    let token = lexer.next_token()
    expect(token.type).toBe(TokenType.INTEGER);
    expect(token.value).toBe(0);
  });

  test('"123456789" should return TokenType.INTEGER with value=123456789', () => {
    var lexer = new Lexer(new StringReader("123456789"))
    let token = lexer.next_token()
    expect(token.type).toBe(TokenType.INTEGER);
    expect(token.value).toBe(123456789);
  });

  test('Max value integer should return TokenType.INTEGER with value=Number.MAX_SAFE_INTEGER', () => {
    var lexer = new Lexer(new StringReader("9007199254740991"))
    let token = lexer.next_token()
    expect(token.type).toBe(TokenType.INTEGER);
    expect(token.value).toBe(Number.MAX_SAFE_INTEGER);
  });

  test('Exceeding value integer should raise an error', () => {
    var lexer = new Lexer(new StringReader("9007199254740992"))
    let token = lexer.next_token()
    expect(token.type).toBe(TokenType.INTEGER);
    expect(token.value).toBe(900719925474099);
    expect(lexer.raised_error).toBe(true);
  });

  test('"0.0" should return TokenType.DOUBLE with value=0.0', () => {
    var lexer = new Lexer(new StringReader("0.0"))
    let token = lexer.next_token()
    expect(token.type).toBe(TokenType.DOUBLE);
    expect(token.value).toBe(0.0);
  });

  test('"123456789.123456789" should return TokenType.DOUBLE with value=123456789.123456789', () => {
    var lexer = new Lexer(new StringReader("123456789.123456789"))
    let token = lexer.next_token()
    expect(token.type).toBe(TokenType.DOUBLE);
    expect(token.value).toBe(123456789.123456789);
  });

  test('Exceeding value double should raise an error', () => {
    var lexer = new Lexer(new StringReader("9007199254740991.9007199254740992"))
    let token = lexer.next_token()
    expect(token.type).toBe(TokenType.DOUBLE);
    expect(token.value).toBe(9007199254740991.9999999999999999);
    expect(lexer.raised_error).toBe(true);
  });

  test('Double with exceeding integer part value should raise an error', () => {
    var lexer = new Lexer(new StringReader("9007199254740992.12345"))
    let token = lexer.next_token()
    expect(token.type).toBe(TokenType.DOUBLE);
    expect(token.value).toBe(900719925474099.0);
    expect(lexer.raised_error).toBe(true);
  });


  test('Reading any char should increment position column', () => {
    var lexer = new Lexer(new StringReader("-"))
    let init_col = lexer.curr_pos.col;
    lexer.next_char()
    expect(lexer.curr_pos.col).toBe(init_col+1);
  });

  test('Reading any char should increment position offset', () => {
    var lexer = new Lexer(new StringReader("-"))
    let init_pos = lexer.curr_pos.pos;
    lexer.next_char()
    expect(lexer.curr_pos.col).toBe(init_pos+1);
  });

  test('"\\n" should change current position to next line', () => {
    var lexer = new Lexer(new StringReader("\n"))
    let init_line = lexer.curr_pos.line;
    lexer.next_token()
    expect(lexer.curr_pos.line).toBe(init_line+1);
    expect(lexer.curr_pos.col).toBe(0);
  });

  test('"\\r" should change current position to next line', () => {
    var lexer = new Lexer(new StringReader("\r"))
    let init_line = lexer.curr_pos.line;
    lexer.next_token()
    expect(lexer.curr_pos.line).toBe(init_line+1);
    expect(lexer.curr_pos.col).toBe(0);
  });

  test('"\\n\\r" should change current position to next line', () => {
    var lexer = new Lexer(new StringReader("\n\r"))
    let init_line = lexer.curr_pos.line;
    lexer.next_token()
    expect(lexer.curr_pos.line).toBe(init_line+1);
    expect(lexer.curr_pos.col).toBe(0);
  });

  test('"\\r\\n" should change current position to next line', () => {
    var lexer = new Lexer(new StringReader("\r\n"))
    let init_line = lexer.curr_pos.line;
    lexer.next_token();
    expect(lexer.curr_pos.line).toBe(init_line+1);
    expect(lexer.curr_pos.col).toBe(0);
  });

  test('"\\n" should increment position offset by 1', () => {
    var lexer = new Lexer(new StringReader("\n"))
    let init_pos = lexer.curr_pos.pos;
    lexer.next_token();
    expect(lexer.curr_pos.pos).toBe(init_pos+1);
  });

  test('"\\r" should increment position offset by 1', () => {
    var lexer = new Lexer(new StringReader("\r"))
    let init_pos = lexer.curr_pos.pos;
    lexer.next_token();
    expect(lexer.curr_pos.pos).toBe(init_pos+1);
  });

  test('"\\n\\r" should increment position offset by 2', () => {
    var lexer = new Lexer(new StringReader("\n\r"))
    let init_pos = lexer.curr_pos.pos;
    lexer.next_token();
    expect(lexer.curr_pos.pos).toBe(init_pos+2);
  });

  test('"\\r\\n" should increment position offset by 2', () => {
    var lexer = new Lexer(new StringReader("\r\n"))
    let init_pos = lexer.curr_pos.pos;
    lexer.next_token();
    expect(lexer.curr_pos.pos).toBe(init_pos+2);
  });

  test('Illegal symbol "~" should raise error', () => {
    var lexer = new Lexer(new StringReader("~"));
    lexer.next_token();
    expect(lexer.raised_error).toBe(true);
  });

  test('Illegal symbol "~" should raise error', () => {
    var lexer = new Lexer(new StringReader("~"));
    lexer.next_token();
    expect(lexer.raised_error).toBe(true);
  });

  test('Unexpected (illegal) token while parsing "&&" operator should raise error', () => {
    var lexer = new Lexer(new StringReader("&~"));
    lexer.next_token();
    expect(lexer.raised_error).toBe(true);
  });

  test('Unexpected (legal) token while parsing "&&" operator should raise error', () => {
    var lexer = new Lexer(new StringReader("&+"));
    lexer.next_token();
    expect(lexer.raised_error).toBe(true);
  });

  test('Unexpected (illegal) token while parsing "||" operator should raise error', () => {
    var lexer = new Lexer(new StringReader("|~"));
    lexer.next_token();
    expect(lexer.raised_error).toBe(true);
  });

  test('Unexpected (legal) token while parsing "||" operator should raise error', () => {
    var lexer = new Lexer(new StringReader("|+"));
    lexer.next_token();
    expect(lexer.raised_error).toBe(true);
  });

});