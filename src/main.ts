import * as util from 'util';
import * as fs from 'fs';
import {Lexer} from '../src/lexer/Lexer';
import { Readable } from 'stream';

// var reader = fs.createReadStream(file_path, {
// 	encoding: 'utf8',
// });

// var i = 0;

// reader.on('readable', () => {
// 	var chunk;
// 	chunk = reader.read(1)
// 	console.log(chunk);
//   });

// var chunk = reader.read(1)
// console.log(chunk);

// const fs = require('fs');



var file_path: string = process.argv.slice(2)[0];
var data = readBytesSync(file_path, 0, 1)
console.log(readBytesSync(file_path, 0, 1).toString());
console.log(readBytesSync(file_path, 1, 1).toString());


// while(i<20){
// 	let data = reader.read(1);
// 	console.log(data);
// 	i = i+1;
// }

// var lexer = new Lexer();