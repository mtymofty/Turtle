import { ObjectInstance } from "../builtin/objs/ObjectInstance"
import { TypeMatching } from "./TypeMatching"

export class Value {
    value: number | boolean | string | ObjectInstance | null = null

    constructor(value: number | boolean | string | ObjectInstance | null) {
        this.value = value
    }

    static getPrintable(value: number | boolean | string | ObjectInstance | null) {
        if (typeof(value) === "number"
        ||  typeof(value) === "boolean"
        ||  typeof(value) === "string"
        ||  value === null) {
            return value
        } else {
            var printable = ""
            printable = printable.concat(`${TypeMatching.getTypeOf(value)} {\n`)

            for (const attr_name in value.attr) {
                printable = printable.concat(`  ${attr_name}: ${Value.getPrintableInternal(value.attr[attr_name].getter())}\n`)
            }

            printable = printable.concat(`}\n`)

            return printable
        }
    }

    private static getPrintableInternal(value: number | boolean | string | ObjectInstance | null) {
        if (typeof(value) === "number"
        ||  typeof(value) === "boolean"
        ||  typeof(value) === "string"
        ||  value === null) {
            return value.toString()
        } else {
            var printable = ""
            printable = printable.concat(TypeMatching.getTypeOf(value))
            return printable
        }
    }
}