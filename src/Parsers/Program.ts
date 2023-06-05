// https://docs.esprima.org/en/latest/syntax-tree-format.html

import { Program } from "esprima"
import { PVariableDeclaration } from "./VariableDeclaration"
import { PFunctionDeclaration } from "./FunctionDeclaration"

class PProgram {
    element: Program;
    constructor(element: Program) {
        this.element = element
    }
    process() {
        for (const statement of this.element.body) {
            switch (statement.type) {
                case "VariableDeclaration":
                    PVariableDeclaration(statement, this.element, true)
                    break
                case "FunctionDeclaration":
                    new PFunctionDeclaration(statement, this.element, true)
                    break
                case "ExpressionStatement":
                    break
                case "IfStatement":
                    break
                case "ForStatement":
                    break
                case "WhileStatement":
                    break
                case "DoWhileStatement":
                    break
                case "SwitchStatement":
                    break
                case "ReturnStatement":
                    break
                case "BreakStatement":
                    break
                case "ContinueStatement":
                    break
                case "ThrowStatement":
                    break
                case "TryStatement":
                    break
                case "DebuggerStatement":
                    break
                case "ImportDeclaration":
                    break
                case "ExportNamedDeclaration":
                    break
                case "ExportDefaultDeclaration":
                    break
                case "ExportAllDeclaration":
                    break
                default:
                    break
            }
        }
    }
}
export default PProgram
