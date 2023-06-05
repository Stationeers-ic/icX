// singleton class

import Throw from "../Exceptions/Err";
import { VariableKind } from "./VariableStorage"
// ActionType = "CreateVariable" | "CreateFunction" | "CallFunction" | "AssignVariable" | "ReturnValue"
export type NumericValue = number | string | (number | string)[];

export type CreateVariableType = {
    type: "CreateVariable";
    name: string;
    value: NumericValue;
    kind: VariableKind;
};
export type ActionType = CreateVariableType;

export class ExecutionStorage {
    lines: ActionType[] = [];
    private static instance: ExecutionStorage;
    private constructor() {}
    static getInstance(): ExecutionStorage {
        if (!ExecutionStorage.instance) {
            ExecutionStorage.instance = new ExecutionStorage();
        }
        return ExecutionStorage.instance;
    }

    addLine(action: ActionType) {
        this.lines.push(action);
    }
}
