import {Prepare} from "./Prepare";
import {CallStatement} from "luaparse";
import {isFunction} from "../types";

export class PrepareCallFunctions extends Prepare {
    declare protected Element: CallStatement;


    run(): void {
        let call: string = '';
        switch (this.Element.expression.base.type) {
            case "Identifier":
                call = this.Element.expression.base.name
                break;
            default:
                break;

        }
        this.compile(call)
    }

    compile(call: string): void {
        const fn = `__${call}` as '__a' // ХАК для TS; fn может быть любой строкой
        if (isFunction(this[fn])) {
            this[fn]()
        } else {

        }
    }

    public __useConstants() {
        this.scope.use.add("constants")
    }

    public __useAliases() {
        this.scope.use.add("aliases")
    }


    __a() {
    }
}
