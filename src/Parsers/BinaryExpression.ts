import { BinaryExpression } from "estree"
import { NumericValue } from "../Storages/ExecutionStorage"
import { getLiteralValue } from "./Literal"



export function getBinaryExpressionValue(expression: BinaryExpression): NumericValue {
    if (expression.left.type == "Literal" && expression.right.type == "Literal") {
        const left = getLiteralValue(expression.left);
        const right = getLiteralValue(expression.right);
        // '+' | '-' | '*' | '/' | '%' | '**' |
        // '|' | '^' | '&' | '==' | '!=' | '===' | '!==' |
        // '<' | '>' | '<=' | '<<' | '>>' | '>>>'
        const result = new Function(`return ${left} ${expression.operator} ${right}`)();
        return result;
    }

        //
        return 0
}
