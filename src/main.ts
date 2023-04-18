import {ReadStream} from 'fs';
import {FileReader, Reader, StringReader} from './Reader';
import {Position} from './Position';

var file_path: string = process.argv.slice(2)[0];
var reader: Reader = new FileReader(file_path);
var pos = new Position();

