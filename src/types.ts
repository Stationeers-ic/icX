import { SourceLocation, VariableDeclaration } from "estree"

export type uses = 'aliases' | 'comments' | 'loop' | 'constants'
export function isUses(use:any):use is uses{
    return true;
}
export type Location = SourceLocation | null | undefined;
export function isVariableDeclaration(val:any): val is VariableDeclaration
{
    return val?.type === 'VariableDeclaration'
}
