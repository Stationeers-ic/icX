import {parseScript, Program} from 'esprima';
import {Directive, ModuleDeclaration, Statement} from "estree";
import {PrepareFunctions} from "./Parsers/PrepareFunctions";
import {PrepareVars} from "./Parsers/PrepareVars";
import {PrepareNewFunctions} from "./Parsers/PrepareNewFunctions";
import {PrepareWhile} from "./Parsers/PrepareWhile";
import {Vars} from "./Storages/Vars";
import {Err} from "./Exceptions/Err";
import {uses} from "./types";


export class IcX {
    public lines: string[] = [];
    public vars = new Vars(this)
    public use = new Set<uses>()

    constructor() {

    }

    run(code: string) {
        console.log(code)
        const program = parseScript(code, {comment: true, loc: true})
        return this.compile(program)
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
            throw new Err(200, value.loc?.start.line, 'Import not supported')
        } else if (value['type'] === 'ExportNamedDeclaration') {
            throw new Err(200, value.loc?.start.line, 'Export not supported')
        } else if (value['type'] === 'ExportDefaultDeclaration') {
            throw new Err(200, value.loc?.start.line, 'Export not supported')
        } else if (value['type'] === 'ExportAllDeclaration') {
            throw new Err(200, value.loc?.start.line, 'Export not supported')
        } else if (value['type'] === 'ClassDeclaration') {
            throw new Err(200, value.loc?.start.line, 'Class not supported')
        }

    }


}
