import { ObjectInstance } from "../builtin/obj/ObjectInstance"

export class Value {
    value: number | boolean | string | ObjectInstance | null = null

    constructor(value: number | boolean | string | ObjectInstance | null) {
        this.value = value
    }
}