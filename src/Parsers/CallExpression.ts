import { CallExpression } from "estree";
import { getExpression } from "./Expression";
import { toNumber } from "./BinaryExpression";
import { ActionType, CreateVariableType, ExecutionStorage, NumericValue } from "../Storages/ExecutionStorage"
import { isActionType, isNumberArray } from "../types"
import Throw from "../Exceptions/Err"

export const supportedFunctions: Map<string, Function | number> = new Map();
supportedFunctions.set("sqrt", Math.sqrt);
supportedFunctions.set("pi", Math.PI);

export function getCallExpressionValue(element: CallExpression): NumericValue {
    // if (element.callee.type === "Super")
    const callee = getExpression(element.callee);
    const args = element.arguments.map(getExpression);
    if (typeof callee === "string") {
        if (supportedFunctions.has(callee)) {
            const result = supportedFunctions.get(callee);
            if (result === undefined) {
                Throw(911, element.callee.loc);
                return 0;
            }
            if (typeof result === "number") {
                return result;
            }
        }
        if (isNumberArray(args)) {
            if (supportedFunctions.has(callee)) {
                const result = supportedFunctions.get(callee);
                if (result === undefined) {
                    Throw(911, element.callee.loc);
                    return 0;
                }
                if (typeof result === "number") {
                    return result;
                }
                return result(...args);
            }
        }
    }
    if (typeof callee !== "string") {
        Throw(110, element.callee.loc);
        return 0;
    }
    const r: ActionType = {
        type: "CallFunction",
        name: callee,
        args: args,
    };


    return r;
}
