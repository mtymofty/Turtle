export abstract class Lines {
    static lines: Line[] = []
}

export type Line = {
    from: [number, number];
    to: [number, number];
    color: [number, number, number, number]
  };