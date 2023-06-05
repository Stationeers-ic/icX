import { UnaryExpression } from "estree";
import { NumericValue } from "../Storages/ExecutionStorage";
import Throw from "../Exceptions/Err";
import { getExpression } from "./Expression";
import { toNumber } from "./BinaryExpression"


export const allowedOperators = ["+", "-", "!"];

export function getUnaryExpressionValue(expression: UnaryExpression): NumericValue {
    const argument = getExpression(expression.argument);
    if (typeof argument === "number") {
        if (!allowedOperators.includes(expression.operator)) {
            Throw(106, expression.loc, expression.operator);
            return 0;
        }
        const result = new Function(`return ${expression.operator}${argument}`)();
        return toNumber(result);
    }

    //
    return 0;
}

