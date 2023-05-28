import {IcX} from "../index";

export class Variable {
    ready: boolean = true
    public initValue?: any
    defaultValue: any;

    constructor(public scope: IcX, public from: string, public to: string, public temp = false, public constant = false) {
    }

    release() {
        this.ready = true
        return this
    }

    get() {
        this.ready = false
        return this
    }

    toString(n: boolean = true) {
        if (this.constant) {
            if (this.scope.use.has('constants')) {
                return this.from
            } else {
                return this.to
            }
        }
        if (this.scope.use.has("aliases") && !this.temp && n) return this.from
        else return this.to
    }
}