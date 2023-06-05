import { ConditionalExpression } from "estree";
import { NumericValue } from "../Storages/ExecutionStorage";
import Throw from "../Exceptions/Err";
import { getExpression } from "./Expression";
import { toNumber } from "./BinaryExpression";
import { Location } from "../types";

export function toBoolean(value: NumericValue | boolean, loc?: Location): NumericValue | boolean {
    if (typeof value === "boolean") return value;
    if (typeof value === "number") return value !== 0;

    if (value === null || value === undefined) return false;
    if (value instanceof RegExp) return false;
    return value;
}

export function getConditionalExpressionValue(expression: ConditionalExpression): NumericValue {
    const test = toBoolean(getExpression(expression.test));
    if (typeof test === "boolean")
        if (test) return getExpression(expression.consequent);
        else return getExpression(expression.alternate);
    return 0;
}
