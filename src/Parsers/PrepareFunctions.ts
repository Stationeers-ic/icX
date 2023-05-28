import {Prepare} from "./Prepare";
import {CallExpression, ExpressionStatement, Identifier} from "estree";
import {isUses} from "../types";
import {Err} from "../Exceptions/Err";

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
                this.prepareNamedFunction(expression, expression.callee)
                break;
            case "MemberExpression":
                throw new Err(956, expression.loc, expression.type);
            case "Super":
                throw new Err(956, expression.loc, expression.type);
            case "CallExpression":
                throw new Err(956, expression.loc, expression.type);
            case "ThisExpression":
                throw new Err(956, expression.loc, expression.type);
            case "FunctionExpression":
                throw new Err(956, expression.loc, expression.type);
            case "ArrowFunctionExpression":
                throw new Err(956, expression.loc, expression.type);
            case "ObjectExpression":
                throw new Err(956, expression.loc, expression.type);
            case "ArrayExpression":
                throw new Err(956, expression.loc, expression.type);
            case "Literal":
                throw new Err(956, expression.loc, expression.type);
            case "TemplateLiteral":
                throw new Err(956, expression.loc, expression.type);
            case "TaggedTemplateExpression":
                throw new Err(956, expression.loc, expression.type);
            case "UnaryExpression":
                throw new Err(956, expression.loc, expression.type);
            case "BinaryExpression":
                throw new Err(956, expression.loc, expression.type);

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
