import { SourceLocation, VariableDeclaration } from "estree"
import { ActionType, NumericValue } from "./Storages/ExecutionStorage"

export type uses = 'aliases' | 'comments' | 'loop' | 'constants'
export function isUses(use:any):use is uses{
    return true;
}
export type Location = SourceLocation | null | undefined;
export function isActionType(val: NumericValue): val is ActionType {
    if (typeof val === "string" || typeof val === "number") return false;
    if (Array.isArray(val)) return false;
    return typeof val.type === "string";
}


export function isNumberArray(val: NumericValue): val is number[] {
    return Array.isArray(val) && val.every(v => typeof v === "number");
}
