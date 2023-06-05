import { Program, FunctionDeclaration } from "estree"
import Throw from "../Exceptions/Err"


export class PFunctionDeclaration {
    type = "VariableDeclaration" as const;
    constructor(public element: FunctionDeclaration, public root: Program, public isRoot: boolean = false) {
        if(!isRoot){
            throw Throw(101)
        }
    }
}
