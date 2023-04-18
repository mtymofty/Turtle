import {Reader} from "../reader/Reader"

export class FileReaded implements Reader {
    constructor() {
    }

    get_char() {
        return "string"
    }

    readBytesSync(filePath: string, filePosition: number, numBytesToRead: number) {
        const buf = Buffer.alloc(numBytesToRead, 0);
        let fd;

        try {
            fd = fs.openSync(filePath, "r");
            fs.readSync(fd, buf, 0, numBytesToRead, filePosition);
        } finally {
            if (fd) {
                fs.closeSync(fd);
            }
        }
        return buf;
    }
}