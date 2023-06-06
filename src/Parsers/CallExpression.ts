import { CallExpression } from "estree";
import { getExpression } from "./Expression";
import { toNumber } from "./BinaryExpression";
import { ActionType, CreateVariableType } from "../Storages/ExecutionStorage"

export const supportedFunctions: Map<string, Function> = new Map();
supportedFunctions.set("sqrt", Math.sqrt);

export function getCallExpressionValue(element: CallExpression) {
    // if (element.callee.type === "Super")
    const callee = getExpression(element.callee);
    const args = element.arguments.map(getExpression);
    console.log(callee, args);
    if (!supportedFunctions.has(callee) || args.find((arg) => typeof arg !== "number")) {
        const value: ActionType = {
            type: "CallFunction",
            name: callee,
            args: args
        };
        return toNumber(callee);
    }

    return 0;
}
