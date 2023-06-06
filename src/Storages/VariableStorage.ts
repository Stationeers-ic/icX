// singleton class

import { SourceLocation } from "estree";
import Throw from "../Exceptions/Err";
import { Location } from "../types";
import { NumericValue } from "./ExecutionStorage";
export type VariableKind = "let" | "var" | "const";

export type Const = {
    type: "const" | "var";
    value: number;
    loc?: Location;
};

export type Var = {
    type: "let";
    value: NumericValue;
    loc?: Location;
};
export type Internal = {
    type: "Internal";
    value: NumericValue;
    loc?: Location;
};

export type Variable = Const | Var;

// let обычная переменная
// var это define
// const невидимая константа

export class VariableStorage {
    static variables: Map<string, Variable | Internal> = new Map();

    static setVar(key: string, kind: "let", value: NumericValue, loc: Location): Variable | null {
        if (this.variables.has(key)) {
            Throw(103, loc, key, this.variables.get(key)?.loc);
            return null;
        }
        const variable: Var = { type: kind, value, loc };
        this.variables.set(key, variable);
        return variable;
    }

    static setConst(key: string, kind: "var" | "const", value: number, loc: Location): Variable | null {
        if (this.variables.has(key)) {
            Throw(103, loc, key, this.variables.get(key)?.loc);
            return null;
        }
        const variable: Const = { type: kind, value, loc };
        this.variables.set(key, variable);
        return variable;
    }
    static getConst(key: string): number | false {
        const variable = this.variables.get(key);
        if (variable?.type === "const") return variable.value;
        return false;
    }
    static exist(key: string): boolean {
        return this.variables.has(key);
    }

    static whereDeclaration(key: string): Location | "Internal" {
        if (this.exist(key)) {
            if (this.variables.get(key)?.type === "Internal") return "Internal";
            Throw(902, undefined, key);
        }
        return this.variables.get(key)?.loc;
    }
}

export default VariableStorage;
