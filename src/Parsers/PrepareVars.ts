import {Prepare} from "./Prepare";
import {Variable} from "../Storages/Variable";

export class PrepareVars extends Prepare {
    declare protected Element:any;

    run(): void {
        const isConst = this.Element.kind === 'const'
        this.Element.declarations.forEach((item:any, index:any) => {
            const id = item.id
            let value: any = undefined
            if (item.init) {
                // const __val = new PrepareInit(this.scope, item.init, index)
                // value = __val.get()
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
