import {Prepare} from "./Prepare";
import {Identifier, VariableDeclaration} from "estree";
import {PrepareInit} from "./PrepareInit";

export class PrepareVars extends Prepare {
    declare protected Element: VariableDeclaration;

    run(): void {

        this.Element.declarations.forEach((item, index) => {
            const id = item.id as Identifier;
            let value: any = undefined
            if (item.init) {
                const __val = new PrepareInit(this.scope, item.init, index)
                value = __val.get()
            }
            const variable = this.scope.vars.set(id.name, value)
            if (this.use('aliases')) {
                this.addLine("alias " + variable.from + " " + variable.to)
                if (value) {
                    this.addLine("move " + variable.from + " " + value)
                }
            } else {
                if (value) {
                    this.addLine("move " + variable.to + " " + value)
                }
            }

        })
    }
}
