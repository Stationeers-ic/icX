import {Prepare} from "./Prepare";
import {CallExpression, ExpressionStatement, Identifier} from "estree";
import {isUses} from "../types";

export class PrepareFunctions extends Prepare {
    declare protected Element: ExpressionStatement

    run(): void {
        switch (this.Element.expression.type) {
            case "CallExpression":
                this.prepareCallee(this.Element.expression)
                break;
        }

    }

    prepareCallee(expression: CallExpression) {
        switch (expression.callee.type) {
            case "Identifier":
                console.log(expression.callee)
                this.prepareNamedFunction(expression, expression.callee)
                break;
            case "MemberExpression":
                console.log(expression)
                break;
            case "Super":
                console.log(expression)
                break;
            case "CallExpression":
                console.log(expression)
                break;
            case "ThisExpression":
                console.log(expression)
                break;
            case "FunctionExpression":
                console.log(expression)
                break;
            case "ArrowFunctionExpression":
                console.log(expression)
                break;
            case "ObjectExpression":
                console.log(expression)
                break;
            case "ArrayExpression":
                console.log(expression)
                break;
            case "Literal":
                console.log(expression)
                break;
            case "TemplateLiteral":
                console.log(expression)
                break;
            case "TaggedTemplateExpression":
                console.log(expression)
                break;
            case "UnaryExpression":
                console.log(expression)
                break;
            case "BinaryExpression":
                console.log(expression)
                break;

        }
    }

    private prepareNamedFunction(expression: CallExpression, callee: Identifier) {
        if (callee.name === 'use') {
            const uses = expression.arguments.map((item) => {
                if (item.type === 'Literal' && isUses(item.value))
                    this.scope.use.add(item.value)
            })
        }
    }
}
