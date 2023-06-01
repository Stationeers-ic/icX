import {Prepare} from "./Prepare";
import {Variable} from "../Storages/Variable";
import * as lua from "luaparse";

export class PrepareVars extends Prepare {
    declare protected Element: lua.AssignmentStatement | lua.LocalStatement;

    run(): void {
        const isConst = this.Element.type !== 'LocalStatement'
        let value: any = undefined
        switch (this.Element.init[0].type) {
            case "NumericLiteral":
                value = this.Element.init[0].value
                break;
            case "FunctionDeclaration":
            case "Identifier":
            case "StringLiteral":
            case "BooleanLiteral":
            case "NilLiteral":
            case "VarargLiteral":
            case "TableConstructorExpression":
            case "BinaryExpression":
            case "LogicalExpression":
            case "UnaryExpression":
            case "MemberExpression":
            case "IndexExpression":
            case "CallExpression":
            case "TableCallExpression":
            case "StringCallExpression":
            default:
                value = undefined

        }
        this.Element.variables.forEach((item, index) => {
            switch (item['type']) {
                case "Identifier":
                    const variable = this.scope.vars.set(item.name, value)
                    variable.constant = isConst
                    this.compile(variable, value)
                    break
                case "IndexExpression":
                case "MemberExpression":
                default:
            }
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
