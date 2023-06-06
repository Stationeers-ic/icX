import { Program, VariableDeclaration, VariableDeclarator } from "estree";
import Throw from "../Exceptions/Err";
import VariableStorage, { VariableKind, Variable } from "../Storages/VariableStorage";
import { ActionType, CreateVariableType, ExecutionStorage, NumericValue } from "../Storages/ExecutionStorage";
import { getExpression } from "./Expression";

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
        const location = VariableStorage.whereDeclaration(element.id.name);
        if (location === "Internal") Throw(108, element.loc, element.id.name);
        else Throw(103, location, element.id.type, "VariableDeclarator");
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
    ExecutionStorage.addLine(value);
    if (kind === "let") {
        VariableStorage.setVar(element.id.name, kind, value.value, element.loc);
    } else if (typeof value.value === "number") {
        VariableStorage.setConst(element.id.name, kind, value.value, element.loc);
    } else {
        if (kind === "var") Throw(109, element.loc, element.id.name);
        else Throw(105, element.loc, element.id.name);
        return;
    }
}

export function PVariableDeclaration(element: VariableDeclaration, root: Program, isRoot: boolean = false) {
    element.declarations.forEach((d) => {
        PVariableDeclarator(d, element.kind, root, isRoot);
    });
}
