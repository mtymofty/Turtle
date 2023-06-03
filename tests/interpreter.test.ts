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
  test('1. ', () => {
    // var lexer = new LexerImp(new StringReader(""))
    // var parser: ParserImp = new ParserImp(lexer);
    // let program = parser.parse()
    // var interpreter = new TestInterpreter();
    // program.accept(interpreter)
    expect(true).toBe(true);
  });
});
