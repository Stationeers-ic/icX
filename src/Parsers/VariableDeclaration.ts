import { Program, VariableDeclaration, VariableDeclarator } from "estree";
import Throw from "../Exceptions/Err";
import VariableStorage, { VariableKind, Variable } from "../Storages/VariableStorage";
import { ActionType, CreateVariableType, ExecutionStorage, NumericValue } from "../Storages/ExecutionStorage";
import { getExpression } from "./Expression"

const executionStorage = ExecutionStorage.getInstance();

export function PVariableDeclarator(
    element: VariableDeclarator,
    kind: VariableKind,
    root: Program,
    isRoot: boolean = false
) {
    if (element.id.type !== "Identifier") {
        Throw(102, element.loc, element.id.type, "VariableDeclarator");
        return;
    }
    if (VariableStorage.exist(element.id.name)) {
        Throw(103, VariableStorage.whereDeclaration(element.id.name), element.id.type, "VariableDeclarator");
        return;
    }
    const value: CreateVariableType = {
        type: "CreateVariable",
        name: element.id.name,
        value: 0,
        kind: kind,
    };
    if (!element.init) {
    } else {
        value.value = getExpression(element.init);
    }
    executionStorage.addLine(value);
    if (kind === "let") {
        VariableStorage.setVar(element.id.name, kind, value.value, element.loc);
    } else if (typeof value.value === "number") {
        VariableStorage.setConst(element.id.name, kind, value.value, element.loc);
    } else {
        Throw(105, element.loc, element.id.name);
        return;
    }
}

export function PVariableDeclaration(element: VariableDeclaration, root: Program, isRoot: boolean = false) {
    element.declarations.forEach((d) => {
        console.log(element.kind);
        PVariableDeclarator(d, element.kind, root, isRoot);
    });
}


