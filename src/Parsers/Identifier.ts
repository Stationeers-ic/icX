import { Identifier } from "estree"
import VariableStorage from "../Storages/VariableStorage"



export function getIdentifierValue(identifier: Identifier): string | number {
    const value = VariableStorage.getConst(identifier.name)
    if (value === false) return identifier.name;
    return value;

}

