import { LexerImp } from '../src/lexer/LexerImp';
import { StringReader } from '../src/source/Reader';
import { Token } from '../src/token/Token';
import { TokenType } from '../src/token/TokenType';

beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

describe('Lexer class tests:', () => {
  test('Empty string should return TokenType.EOF', () => {
    var lexer = new LexerImp(new StringReader(""))
    expect(lexer.next_token().type).toBe(TokenType.EOF);
  });

  test('"=" should return TokenType.ASSIGN_OP', () => {
    var lexer = new LexerImp(new StringReader("="))
    expect(lexer.next_token().type).toBe(TokenType.ASSIGN_OP);
  });

  test('"+" should return TokenType.ADD_OP', () => {
    var lexer = new LexerImp(new StringReader("+"))
    expect(lexer.next_token().type).toBe(TokenType.ADD_OP);
  });

  test('"*" should return TokenType.MULT_OP', () => {
    var lexer = new LexerImp(new StringReader("*"))
    expect(lexer.next_token().type).toBe(TokenType.MULT_OP);
  });

  test('"/" should return TokenType.DIV_OP', () => {
    var lexer = new LexerImp(new StringReader("/"))
    expect(lexer.next_token().type).toBe(TokenType.DIV_OP);
  });

  test('"//" should return TokenType.DIV_INT_OP', () => {
    var lexer = new LexerImp(new StringReader("//"))
    expect(lexer.next_token().type).toBe(TokenType.DIV_INT_OP);
  });

  test('"^" should return TokenType.POW_OP', () => {
    var lexer = new LexerImp(new StringReader("^"))
    expect(lexer.next_token().type).toBe(TokenType.POW_OP);
  });

  test('"%" should return TokenType.MOD_OP', () => {
    var lexer = new LexerImp(new StringReader("%"))
    expect(lexer.next_token().type).toBe(TokenType.MOD_OP);
  });

  test('"==" should return TokenType.EQ_OP', () => {
    var lexer = new LexerImp(new StringReader("=="))
    expect(lexer.next_token().type).toBe(TokenType.EQ_OP);
  });

  test('"!=" should return TokenType.NEQ_OP', () => {
    var lexer = new LexerImp(new StringReader("!="))
    expect(lexer.next_token().type).toBe(TokenType.NEQ_OP);
  });

  test('">" should return TokenType.GRT_OP', () => {
    var lexer = new LexerImp(new StringReader(">"))
    expect(lexer.next_token().type).toBe(TokenType.GRT_OP);
  });

  test('">=" should return TokenType.GRT_EQ_OP', () => {
    var lexer = new LexerImp(new StringReader(">="))
    expect(lexer.next_token().type).toBe(TokenType.GRT_EQ_OP);
  });

  test('"<" should return TokenType.LESS_OP', () => {
    var lexer = new LexerImp(new StringReader("<"))
    expect(lexer.next_token().type).toBe(TokenType.LESS_OP);
  });

  test('"<=" should return TokenType.LESS_EQ_OP', () => {
    var lexer = new LexerImp(new StringReader("<="))
    expect(lexer.next_token().type).toBe(TokenType.LESS_EQ_OP);
  });

  test('"&&" should return TokenType.AND_OP', () => {
    var lexer = new LexerImp(new StringReader("&&"))
    expect(lexer.next_token().type).toBe(TokenType.AND_OP);
  });

  test('"||" should return TokenType.OR_OP', () => {
    var lexer = new LexerImp(new StringReader("||"))
    expect(lexer.next_token().type).toBe(TokenType.OR_OP);
  });

  test('"!" should return TokenType.NOT_OP', () => {
    var lexer = new LexerImp(new StringReader("!"))
    expect(lexer.next_token().type).toBe(TokenType.NOT_OP);
  });

  test('"-" should return TokenType.MINUS_OP', () => {
    var lexer = new LexerImp(new StringReader("-"))
    expect(lexer.next_token().type).toBe(TokenType.MINUS_OP);
  });

  test('"." should return TokenType.DOT_OP', () => {
    var lexer = new LexerImp(new StringReader("."))
    expect(lexer.next_token().type).toBe(TokenType.DOT_OP);
  });

  test('"(" should return TokenType.L_BRACE_OP', () => {
    var lexer = new LexerImp(new StringReader("(=)"))
    expect(lexer.next_token().type).toBe(TokenType.L_BRACE_OP);
  });

  test('"{" should return TokenType.L_C_BRACE_OP', () => {
    var lexer = new LexerImp(new StringReader("{"))
    expect(lexer.next_token().type).toBe(TokenType.L_C_BRACE_OP);
  });

  test('")" should return TokenType.R_BRACE_OP', () => {
    var lexer = new LexerImp(new StringReader(")"))
    expect(lexer.next_token().type).toBe(TokenType.R_BRACE_OP);
  });

  test('"}" should return TokenType.R_C_BRACE_OP', () => {
    var lexer = new LexerImp(new StringReader("}"))
    expect(lexer.next_token().type).toBe(TokenType.R_C_BRACE_OP);
  });

  test('"," should return TokenType.COMMA_OP', () => {
    var lexer = new LexerImp(new StringReader(","))
    expect(lexer.next_token().type).toBe(TokenType.COMMA_OP);
  });

  test('";" should return TokenType.TERMINATOR', () => {
    var lexer = new LexerImp(new StringReader(";"))
    expect(lexer.next_token().type).toBe(TokenType.TERMINATOR);
  });

  test('"0" should return TokenType.INTEGER with value=0', () => {
    var lexer = new LexerImp(new StringReader("0"))
    let token = lexer.next_token()
    expect(token.type).toBe(TokenType.INTEGER);
    expect(token.value).toBe(0);
  });

  test('"123456789" should return TokenType.INTEGER with value=123456789', () => {
    var lexer = new LexerImp(new StringReader("123456789"))
    let token = lexer.next_token()
    expect(token.type).toBe(TokenType.INTEGER);
    expect(token.value).toBe(123456789);
  });

  test('Max value integer should return TokenType.INTEGER with value=Number.MAX_SAFE_INTEGER', () => {
    var lexer = new LexerImp(new StringReader("9007199254740991"))
    let token = lexer.next_token()
    expect(token.type).toBe(TokenType.INTEGER);
    expect(token.value).toBe(Number.MAX_SAFE_INTEGER);
  });

  test('"0.0" should return TokenType.DOUBLE with value=0.0', () => {
    var lexer = new LexerImp(new StringReader("0.0"))
    let token = lexer.next_token()
    expect(token.type).toBe(TokenType.DOUBLE);
    expect(token.value).toBe(0.0);
  });

  test('"123456789.123456789" should return TokenType.DOUBLE with value=123456789.123456789', () => {
    var lexer = new LexerImp(new StringReader("123456789.123456789"))
    let token = lexer.next_token()
    expect(token.type).toBe(TokenType.DOUBLE);
    expect(token.value).toBe(123456789.123456789);
  });

  test('"#" should return TokenType.COMMENT with value=""', () => {
    var lexer = new LexerImp(new StringReader("#"))
    var token = lexer.next_token();
    expect(token.type).toBe(TokenType.COMMENT);
    expect(token.value).toBe("");
  });

  test('"#\\n" should return TokenType.COMMENT with value=""', () => {
    var lexer = new LexerImp(new StringReader("#\n"))
    var token = lexer.next_token();
    expect(token.type).toBe(TokenType.COMMENT);
    expect(token.value).toBe("");
  });

  test('"#abc" should return TokenType.COMMENT with value="abc"', () => {
    var lexer = new LexerImp(new StringReader("#abc"))
    var token = lexer.next_token();
    expect(token.type).toBe(TokenType.COMMENT);
    expect(token.value).toBe("abc");
  });

  test('"#abc\\n" should return TokenType.COMMENT with value="abc"', () => {
    var lexer = new LexerImp(new StringReader("#abc\n"))
    var token = lexer.next_token();
    expect(token.type).toBe(TokenType.COMMENT);
    expect(token.value).toBe("abc");
  });

  test('"#abc\\ndef" should return TokenType.COMMENT and value string should only contain chars before newline', () => {
    var lexer = new LexerImp(new StringReader("#abc\n"))
    var token = lexer.next_token();
    expect(token.type).toBe(TokenType.COMMENT);
    expect(token.value).toBe("abc");
  });

  test('"a" should return TokenType.IDENTIFIER with value="a"', () => {
    var lexer = new LexerImp(new StringReader("a"))
    var token = lexer.next_token();
    expect(token.type).toBe(TokenType.IDENTIFIER);
    expect(token.value).toBe("a");
  });

  test('"юя" should return TokenType.IDENTIFIER with value="юя"', () => {
    var lexer = new LexerImp(new StringReader("юя"))
    var token = lexer.next_token();
    expect(token.type).toBe(TokenType.IDENTIFIER);
    expect(token.value).toBe("юя");
  });

  test('"a_b" should return TokenType.IDENTIFIER with value="a_b"', () => {
    var lexer = new LexerImp(new StringReader("a_b"))
    var token = lexer.next_token();
    expect(token.type).toBe(TokenType.IDENTIFIER);
    expect(token.value).toBe("a_b");
  });

  test('Max length identifier should return TokenType.IDENTIFIER with value="a"*50', () => {
    var lexer = new LexerImp(new StringReader("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"))
    var token = lexer.next_token();
    expect(token.type).toBe(TokenType.IDENTIFIER);
    expect(token.value).toBe("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
  });

  test('"func" should return TokenType.FUN_KW with value="func"', () => {
    var lexer = new LexerImp(new StringReader("func"))
    var token = lexer.next_token();
    expect(token.type).toBe(TokenType.FUN_KW);
    expect(token.value).toBe("func");
  });

  test('"return" should return TokenType.RET_KW with value="return"', () => {
    var lexer = new LexerImp(new StringReader("return"))
    var token = lexer.next_token();
    expect(token.type).toBe(TokenType.RET_KW);
    expect(token.value).toBe("return");
  });

  test('"while" should return TokenType.WHILE_KW with value="while"', () => {
    var lexer = new LexerImp(new StringReader("while"))
    var token = lexer.next_token();
    expect(token.type).toBe(TokenType.WHILE_KW);
    expect(token.value).toBe("while");
  });

  test('"break" should return TokenType.BREAK_KW with value="break"', () => {
    var lexer = new LexerImp(new StringReader("break"))
    var token = lexer.next_token();
    expect(token.type).toBe(TokenType.BREAK_KW);
    expect(token.value).toBe("break");
  });

  test('"continue" should return TokenType.CONTINUE_KW with value="continue"', () => {
    var lexer = new LexerImp(new StringReader("continue"))
    var token = lexer.next_token();
    expect(token.type).toBe(TokenType.CONTINUE_KW);
    expect(token.value).toBe("continue");
  });

  test('"null" should return TokenType.NULL_KW with value="null"', () => {
    var lexer = new LexerImp(new StringReader("null"))
    var token = lexer.next_token();
    expect(token.type).toBe(TokenType.NULL_KW);
    expect(token.value).toBe("null");
  });

  test('"if" should return TokenType.IF_KW with value="if"', () => {
    var lexer = new LexerImp(new StringReader("if"))
    var token = lexer.next_token();
    expect(token.type).toBe(TokenType.IF_KW);
    expect(token.value).toBe("if");
  });

  test('"else" should return TokenType.ELSE_KW with value="else"', () => {
    var lexer = new LexerImp(new StringReader("else"))
    var token = lexer.next_token();
    expect(token.type).toBe(TokenType.ELSE_KW);
    expect(token.value).toBe("else");
  });

  test('"unless" should return TokenType.UNLESS_KW with value="unless"', () => {
    var lexer = new LexerImp(new StringReader("unless"))
    var token = lexer.next_token();
    expect(token.type).toBe(TokenType.UNLESS_KW);
    expect(token.value).toBe("unless");
  });

  test('"true" should return TokenType.TRUE_KW with value="true"', () => {
    var lexer = new LexerImp(new StringReader("true"))
    var token = lexer.next_token();
    expect(token.type).toBe(TokenType.TRUE_KW);
    expect(token.value).toBe("true");
  });

  test('"false" should return TokenType.FALSE_KW with value="false"', () => {
    var lexer = new LexerImp(new StringReader("false"))
    var token = lexer.next_token();
    expect(token.type).toBe(TokenType.FALSE_KW);
    expect(token.value).toBe("false");
  });

  test(`'""' should return TokenType.STRING with value=""`, () => {
    var lexer = new LexerImp(new StringReader(`""`))
    var token = lexer.next_token();
    expect(token.type).toBe(TokenType.STRING);
    expect(token.value).toBe("");
  });

  test(`'"a"' should return TokenType.STRING with value="a"`, () => {
    var lexer = new LexerImp(new StringReader(`"a"`))
    var token = lexer.next_token();
    expect(token.type).toBe(TokenType.STRING);
    expect(token.value).toBe("a");
  });

  test(`'"+!  _1ą  ćź"' should return TokenType.STRING with value="+!  _1ą  ćź"`, () => {
    var lexer = new LexerImp(new StringReader(`"+!  _1ą  ćź"`))
    var token = lexer.next_token();
    expect(token.type).toBe(TokenType.STRING);
    expect(token.value).toBe("+!  _1ą  ćź");
  });

  test(`'"\\n"' should return TokenType.STRING with escaped newline char`, () => {
    var lexer = new LexerImp(new StringReader(`"\\n"`))
    var token = lexer.next_token();
    expect(token.type).toBe(TokenType.STRING);
    expect(token.value).toBe("\n");
  });

  test(`'"\\t"' should return TokenType.STRING with escaped tabulation char`, () => {
    var lexer = new LexerImp(new StringReader(`"\\t"`))
    var token = lexer.next_token();
    expect(token.type).toBe(TokenType.STRING);
    expect(token.value).toBe("\t");
  });

  test(`'"\\\\"' should return TokenType.STRING with escaped backslash char`, () => {
    var lexer = new LexerImp(new StringReader(`"\\\\"`))
    var token = lexer.next_token();
    expect(token.type).toBe(TokenType.STRING);
    expect(token.value).toBe("\\");
  });

  test(`'"\\""' should return TokenType.STRING with escaped quotation char`, () => {
    var lexer = new LexerImp(new StringReader(`"\\""`))
    var token = lexer.next_token();
    expect(token.type).toBe(TokenType.STRING);
    expect(token.value).toBe("\"");
  });

  test('Reading any char should increment position column', () => {
    var lexer = new LexerImp(new StringReader("-"))
    let init_col = lexer.get_reader().curr_pos.col;
    lexer.next_char()
    expect(lexer.get_reader().curr_pos.col).toBe(init_col+1);
  });

  test('Reading any char should increment position offset', () => {
    var lexer = new LexerImp(new StringReader("-"))
    let init_pos = lexer.get_reader().curr_pos.pos;
    lexer.next_char()
    expect(lexer.get_reader().curr_pos.pos).toBe(init_pos+1);
  });

  test('"\\n" should change current position to next line', () => {
    var lexer = new LexerImp(new StringReader("\n"))
    let init_line = lexer.get_reader().curr_pos.line;
    lexer.next_token()
    expect(lexer.get_reader().curr_pos.line).toBe(init_line+1);
    expect(lexer.get_reader().curr_pos.col).toBe(1);
  });

  test('"\\r" should change current position to next line', () => {
    var lexer = new LexerImp(new StringReader("\r"))
    let init_line = lexer.get_reader().curr_pos.line;
    lexer.next_token()
    expect(lexer.get_reader().curr_pos.line).toBe(init_line+1);
    expect(lexer.get_reader().curr_pos.col).toBe(1);
  });

  test('"\\n\\r" should change current position to next line', () => {
    var lexer = new LexerImp(new StringReader("\n\r"))
    let init_line = lexer.get_reader().curr_pos.line;
    lexer.next_token()
    expect(lexer.get_reader().curr_pos.line).toBe(init_line+1);
    expect(lexer.get_reader().curr_pos.col).toBe(1);
  });

  test('"\\r\\n" should change current position to next line', () => {
    var lexer = new LexerImp(new StringReader("\r\n"))
    let init_line = lexer.get_reader().curr_pos.line;
    lexer.next_token();
    expect(lexer.get_reader().curr_pos.line).toBe(init_line+1);
    expect(lexer.get_reader().curr_pos.col).toBe(1);
  });

  test('"\\n" should increment position offset by 1', () => {
    var lexer = new LexerImp(new StringReader("\n"))
    let init_pos = lexer.get_reader().curr_pos.pos;
    lexer.next_token();
    expect(lexer.get_reader().curr_pos.pos).toBe(init_pos+1);
  });

  test('"\\r" should increment position offset by 1', () => {
    var lexer = new LexerImp(new StringReader("\r"))
    let init_pos = lexer.get_reader().curr_pos.pos;
    lexer.next_token();
    expect(lexer.get_reader().curr_pos.pos).toBe(init_pos+1);
  });

  test('"\\n\\r" should increment position offset by 2', () => {
    var lexer = new LexerImp(new StringReader("\n\r"))
    let init_pos = lexer.get_reader().curr_pos.pos;
    lexer.next_token();
    expect(lexer.get_reader().curr_pos.pos).toBe(init_pos+2);
  });

  test('"\\r\\n" should increment position offset by 2', () => {
    var lexer = new LexerImp(new StringReader("\r\n"))
    let init_pos = lexer.get_reader().curr_pos.pos;
    lexer.next_token();
    expect(lexer.get_reader().curr_pos.pos).toBe(init_pos+2);
  });

  test('Illegal symbol "~" should raise error', () => {
    var lexer = new LexerImp(new StringReader("~"));
    lexer.next_token();
    expect(lexer.did_raise_error()).toBe(true);
  });

  test('Illegal symbol "~" should raise error', () => {
    var lexer = new LexerImp(new StringReader("~"));
    lexer.next_token();
    expect(lexer.did_raise_error()).toBe(true);
  });

  test('Unexpected (illegal) token while parsing "&&" operator should raise error and return empty token', () => {
    var lexer = new LexerImp(new StringReader("&~"));
    var token = lexer.next_token();
    expect(lexer.did_raise_error()).toBe(true);
    expect(token.type).toBe(TokenType.INVALID);
  });

  test('Unexpected (legal) token while parsing "&&" operator should raise error and return empty token', () => {
    var lexer = new LexerImp(new StringReader("&+"));
    var token = lexer.next_token();
    expect(lexer.did_raise_error()).toBe(true);
    expect(token.type).toBe(TokenType.INVALID);
  });

  test('Unexpected (illegal) token while parsing "||" operator should raise error and return empty token', () => {
    var lexer = new LexerImp(new StringReader("|~"));
    var token = lexer.next_token();
    expect(lexer.did_raise_error()).toBe(true);
    expect(token.type).toBe(TokenType.INVALID);
  });

  test('Unexpected (legal) token while parsing "||" operator should raise error and return empty token', () => {
    var lexer = new LexerImp(new StringReader("|+"));
    var token = lexer.next_token();
    expect(lexer.did_raise_error()).toBe(true);
    expect(token.type).toBe(TokenType.INVALID);
  });

  test('Exceeding value integer should raise an error and return token', () => {
    var lexer = new LexerImp(new StringReader("9007199254740992"))
    let token = lexer.next_token()
    expect(token.type).toBe(TokenType.INTEGER);
    expect(token.value).toBe(900719925474099);
    expect(lexer.did_raise_error()).toBe(true);
  });

  test('Integer with preceding zero should raise an error and return token', () => {
    var lexer = new LexerImp(new StringReader("0123"))
    let token = lexer.next_token()
    expect(token.type).toBe(TokenType.INTEGER);
    expect(token.value).toBe(0);
    expect(lexer.did_raise_error()).toBe(true);
  });

  test('Exceeding value double should raise an error and return token', () => {
    var lexer = new LexerImp(new StringReader("9007199254740991.9007199254740992"))
    let token = lexer.next_token()
    expect(token.type).toBe(TokenType.DOUBLE);
    expect(token.value).toBe(9007199254740991.900719925474099);
    expect(lexer.did_raise_error()).toBe(true);
  });

  test('Double with exceeding integer part value should raise an error and return token', () => {
    var lexer = new LexerImp(new StringReader("9007199254740992.12345"))
    let token = lexer.next_token()
    expect(token.type).toBe(TokenType.DOUBLE);
    expect(token.value).toBe(900719925474099.0);
    expect(lexer.did_raise_error()).toBe(true);
  });

  test('Double with exceeding integer part value should raise an error and excess digits should be skipped', () => {
    var lexer = new LexerImp(new StringReader("9007199254740992.12345"))
    var token = lexer.next_token()
    expect(token.type).toBe(TokenType.DOUBLE);
    expect(token.value).toBe(900719925474099.0);
    expect(lexer.did_raise_error()).toBe(true);
    token = lexer.next_token()
    expect(token.type).toBe(TokenType.EOF);
    expect(token.pos.pos).toBe(22);

  });

  test('Double with preceding zero should raise an error and return token', () => {
    var lexer = new LexerImp(new StringReader("01.23"))
    let token = lexer.next_token()
    expect(token.type).toBe(TokenType.DOUBLE);
    expect(token.value).toBe(0.0);
    expect(lexer.did_raise_error()).toBe(true);
  });

  test('Double with preceding zero should raise an error and and excess digits should be skipped', () => {
    var lexer = new LexerImp(new StringReader("01.23"))
    var token = lexer.next_token()
    expect(token.type).toBe(TokenType.DOUBLE);
    expect(token.value).toBe(0.0);
    expect(lexer.did_raise_error()).toBe(true);
    token = lexer.next_token()
    expect(token.type).toBe(TokenType.EOF);
    expect(token.pos.pos).toBe(5);
  });

  test('Too long indentifier (51) should raise an error and return token', () => {
    var lexer = new LexerImp(new StringReader("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"))
    var token = lexer.next_token();
    expect(lexer.did_raise_error()).toBe(true);
    expect(token.type).toBe(TokenType.IDENTIFIER);
    expect(token.value).toBe("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
  });

  test('Too long indentifier (51) should raise an error and excess chars should be skipped', () => {
    var lexer = new LexerImp(new StringReader("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"))
    var token = lexer.next_token();
    expect(lexer.did_raise_error()).toBe(true);
    expect(token.type).toBe(TokenType.IDENTIFIER);
    expect(token.value).toBe("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    token = lexer.next_token();
    expect(token.type).toBe(TokenType.EOF);
    expect(token.pos.pos).toBe(1+50); // 50 - identifier len
  });

  test('Too long string (201) should raise an error and return token', () => {
    var lexer = new LexerImp(new StringReader(`"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"`))
    var token = lexer.next_token();
    expect(lexer.did_raise_error()).toBe(true);
    expect(token.type).toBe(TokenType.STRING);
    expect(token.value).toBe("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
  });

  test('Too long string (201) should raise an error and excess chars should be skipped', () => {
    var lexer = new LexerImp(new StringReader('"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"'))
    var token = lexer.next_token();
    expect(lexer.did_raise_error()).toBe(true);
    expect(token.type).toBe(TokenType.STRING);
    expect(token.value).toBe("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    token = lexer.next_token();
    expect(token.type).toBe(TokenType.EOF);
    expect(token.pos.pos).toBe(1+200+2);  // 200 - string len, 2 - quotes
  });

  test('String lacking closing bracket (EOL) should rise an error and return a token', () => {
    var lexer = new LexerImp(new StringReader('"aaa\n'))
    var token = lexer.next_token();
    expect(lexer.did_raise_error()).toBe(true);
    expect(token.type).toBe(TokenType.STRING);
    expect(token.value).toBe("aaa");
  });

  test('String lacking closing bracket (EOF) should rise an error and return a token', () => {
    var lexer = new LexerImp(new StringReader('"aaa'))
    var token = lexer.next_token();
    expect(lexer.did_raise_error()).toBe(true);
    expect(token.type).toBe(TokenType.STRING);
    expect(token.value).toBe("aaa");
  });

});
