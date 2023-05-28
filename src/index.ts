import {parseScript, Program} from 'esprima';
import {Directive, ModuleDeclaration, Statement} from "estree";
import {PrepareFunctions} from "./parsers/PrepareFunctions";
import {PrepareVars} from "./parsers/PrepareVars";
import {PrepareNewFunctions} from "./parsers/PrepareNewFunctions";
import {PrepareWhile} from "./parsers/PrepareWhile";
import {Vars} from "./storages/Vars";
import {SyntaxException} from "./Exceptions/SyntaxException";

export class IcX {
    public lines: string[] = [];
    public vars = new Vars()

    constructor() {
    }

    run(code: string) {
        console.log(code)
        const program = parseScript(code, {comment: true, loc: true})
        this.compile(program)
        // console.log(JSON.stringify(program, null, 2))
    }

    compile(program: Program): string {
        this.lines = []
        program.body.forEach((value, index, array) => {
            this.prepareItem(value, index, array)
        })
        return this.lines.join("\n")
    }

    public prepareItem(value: (Directive | Statement | ModuleDeclaration), index: number, array: (Directive | Statement | ModuleDeclaration)[]) {
        if (value['type'] === 'ExpressionStatement') {
            new PrepareFunctions(this, value, index, array)
        } else if (value['type'] === 'VariableDeclaration') {
            new PrepareVars(this, value, index, array)
        } else if (value['type'] === 'FunctionDeclaration') {
            new PrepareNewFunctions(this, value, index, array)
        } else if (value['type'] === 'WhileStatement') {
            new PrepareWhile(this, value, index, array)
        } else if (value['type'] === 'ImportDeclaration') {
            throw new SyntaxException('Import not supported')
        } else if (value['type'] === 'ExportNamedDeclaration') {
            throw new SyntaxException('Export not supported')
        } else if (value['type'] === 'ExportDefaultDeclaration') {
            throw new SyntaxException('Export not supported')
        } else if (value['type'] === 'ExportAllDeclaration') {
            throw new SyntaxException('Export not supported')
        } else if (value['type'] === 'ClassDeclaration') {
            throw new SyntaxException('Class not supported')
        }

    }


}
