export function find_occurances(char: string, string:string): number[] {
    var indexes = [];
    for (let i = 0; i < string.length; i++) {
        if (string[i] === char) {
            indexes.push(i);
        }
    }
    return indexes;
}

export function insert(original: string, i: number, substr: string): string{
    return original.substring(0, i) + substr + original.substring(i + substr.length);
}

export function printable(char: string): string{
    return JSON.stringify(char).slice(1, -1);
}
