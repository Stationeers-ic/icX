// singleton class

import Throw from "../Exceptions/Err";
import { VariableKind } from "./VariableStorage"
// ActionType = "CreateVariable" | "CreateFunction" | "CallFunction" | "AssignVariable" | "ReturnValue"
export type NumericValue = number | string | ActionType | NumericValue[];
// export type DataValue = NumericValue | ActionType;

export type CreateVariableType = {
    type: "CreateVariable";
    name: string;
    value: NumericValue;
    kind: VariableKind;
};
export type CallFunctionType = {
    type: "CallFunction";
    name: NumericValue;
    args: NumericValue[];
};
export type ActionType = CreateVariableType | CallFunctionType;

export class ExecutionStorage {
    static lines: ActionType[] = [];
    private static instance: ExecutionStorage;
    private constructor() {}
    static getInstance(): ExecutionStorage {
        if (!ExecutionStorage.instance) {
            ExecutionStorage.instance = new ExecutionStorage();
        }
        return ExecutionStorage.instance;
    }

    static addLine(action: ActionType) {
        this.lines.push(action);
    }
}
