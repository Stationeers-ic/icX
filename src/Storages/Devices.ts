import {Variable} from "./Variable";
import {IcX} from "../index";

export class Devices extends Variable {
    constructor(scope: IcX, from: string, to: string, temp = false, constant = false) {
        super(scope, from, to, temp, constant)
        this.constant = true
    }

    get() {
        this.ready = true
        return this
    }
}
