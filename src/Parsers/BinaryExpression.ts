import { BinaryExpression, LogicalExpression } from "estree";
import { NumericValue } from "../Storages/ExecutionStorage";
import { getLiteralValue, getNumericValue } from "./Literal";
import Throw from "../Exceptions/Err";
import { getExpression } from "./Expression";

export function toNumber(value: NumericValue): NumericValue {
    if (typeof value === "number") return value;
    if (typeof value === "boolean") return value ? 1 : 0;
    if (value === null) return 0;
    if (value === undefined) return 0;
    if (typeof value === "bigint") return Number(value);
    if (value instanceof RegExp) return 0;
    return value;
}

export const allowedOperators = [
    "+",
    "-",
    "*",
    "/",
    "%",
    "**",
    "|",
    "^",
    "&",
    "==",
    "!=",
    "<",
    ">",
    "<=",
    "<<",
    ">>",
    ">>>",
    "&&",
    "||",
];

export function getBinaryExpressionValue(expression: BinaryExpression | LogicalExpression): NumericValue {
    const left = getExpression(expression.left);
    const right = getExpression(expression.right);
    if (typeof left === "number" && typeof right === "number") {
        if (!allowedOperators.includes(expression.operator)) {
            Throw(106, expression.loc, expression.operator);
            return 0;
        }
        console.log(`return ${left} ${expression.operator} ${right}`);
        const result = new Function(`return ${left} ${expression.operator} ${right}`)();
        return toNumber(result);
    }
    const combined = [left, expression.operator, right];
    // try to optimize
    console.log(JSON.stringify(combined));

    return combined;
}
