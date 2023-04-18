import { ReadStream } from 'fs';
import {FileReader, Reader} from '../src/reader/Reader';

var file_path: string = process.argv.slice(2)[0];

var reader = new FileReader(file_path);

var i = 0
while (i < 200) {
    var char = reader.get_char();
    console.log(char);
    i += 1;
    if (char == null) {
        console.log("Koniec");
        break;
    }
}
