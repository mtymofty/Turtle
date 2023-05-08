import { ErrorHandler } from "../src/error/ErrorHandler";
import { Reader, FileReader, StringReader } from "../src/source/Reader";

const mock_exit = jest.spyOn(process, 'exit')
            .mockImplementation((number) => { throw new Error('process.exit: ' + number); });

beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    });

describe('Source tests:', () => {
    test('FileReader constructor with valid file_name', () => {
        const reader_constructor = () => {
            new FileReader("tests/test.txt", new ErrorHandler());
        };

        expect(reader_constructor).not.toThrow();
    });

    test('FileReader constructor with invalid file_name', async () => {
        const reader_constructor = () => {
            new FileReader("invalid_test.txt", new ErrorHandler());
        };

        expect(reader_constructor).toThrow();
        expect(mock_exit).toHaveBeenCalledWith(0);
      });
});