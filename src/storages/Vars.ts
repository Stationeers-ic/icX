import {VarsException} from "../Exceptions/VarsException";

export class Vars {
    public aliases = new Set<string>()
    public values = new Map<string, any>()


    add(key: string, value: any) {
        if (this.keys.has(key)) {
            throw new VarsException('already exists', key)
        }
    }
    set(key: string, value: any) {
        if (!this.keys.has(key)) {
            throw new VarsException('already exists', key)
        }
    }
}
