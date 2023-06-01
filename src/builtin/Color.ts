export class Color {
    a: number //0-100
    r: number //0-255
    g: number //0-255
    b: number //0-255

    constructor(a?: number, r?: number, g?: number, b?: number) {
        this.a = (a) ? a : 100;
        this.r = (r) ? r : 0;
        this.g = (g) ? g : 0;
        this.b = (b) ? b : 0;
    }
}
