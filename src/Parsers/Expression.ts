import { Expression } from "estree";
import { getIdentifierValue } from "./Identifier";
import { getLiteralValue } from "./Literal";
import { getBinaryExpressionValue } from "./BinaryExpression";
import Throw from "../Exceptions/Err";
import { NumericValue } from "../Storages/ExecutionStorage"
import { getUnaryExpressionValue } from "./UnaryExpression"
import { getConditionalExpressionValue } from "./ConditionalExpression"

export function getExpression(element: Expression): NumericValue {
    if (element.type === "Identifier") {
        return getIdentifierValue(element);
    }
    if (element.type === "Literal") {
        return getLiteralValue(element);
    }
    if (element.type === "BinaryExpression" || element.type === "LogicalExpression") {
        return getBinaryExpressionValue(element);
    }
    if (element.type === "UnaryExpression") {
        return getUnaryExpressionValue(element);
    }
    if (element.type === "ConditionalExpression") {
        return getConditionalExpressionValue(element);
    }
    Throw(101, element.loc, element.type);
    return 0;
}
