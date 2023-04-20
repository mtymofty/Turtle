export function numeric_value(char: string) {
    return char.charCodeAt(0) - 48; //48 = '0'.charCodeAt(0)
}