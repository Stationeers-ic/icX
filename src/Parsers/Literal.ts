import { Literal } from "estree"
import Throw from "../Exceptions/Err"
import { Location } from "../types";

export function getNumericValue(
    value: string | number | bigint | boolean | RegExp | null | undefined,
    loc: Location
): number {
    if (typeof value === "number") return value;
    if (typeof value === "boolean") return value ? 1 : 0;
    if (typeof value === "string") {
        Throw(107, loc);
        return 0;
    }
    Throw(104, loc, value?.toString());
    if (value === null) return 0;
    if (value === undefined) return 0;
    if (typeof value === "bigint") return Number(value);
    if (value instanceof RegExp) return 0;
    return 0;
}

export function getLiteralValue(literal: Literal): number {
    return getNumericValue(literal?.value, literal.loc);
}
