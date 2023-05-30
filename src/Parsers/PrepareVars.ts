import {Prepare} from "./Prepare";
import {Identifier, VariableDeclaration} from "estree";
import {PrepareInit} from "./PrepareInit";
import {Variable} from "../Storages/Variable";

export class PrepareVars extends Prepare {
    declare protected Element: VariableDeclaration;

    run(): void {
        const isConst = this.Element.kind === 'const'
        this.Element.declarations.forEach((item, index) => {
            const id = item.id as Identifier;
            let value: any = undefined
            if (item.init) {
                const __val = new PrepareInit(this.scope, item.init, index)
                value = __val.get()
            }
            const variable = this.scope.vars.set(id.name, value)
            variable.constant = isConst
            this.compile(variable, value)

        })
    }

    compile(variable: Variable, value: any): void {
        let fn = ''
        let from = ''
        let to = ''
        if (variable.constant) {
            from = variable.from
            if (this.use('constants')) {
                fn = 'define'
            } else {
                fn = ''
            }
        } else {
            fn = 'move'
            if (this.use('aliases')) {
                from = variable.from
                this.addLine("alias " + variable.from + " " + variable.to)
            } else {
                from = variable.to
            }
        }
        if (value && fn) {
            this.addLine(`${fn} ${from} ${value}`)
        }
    }
}
