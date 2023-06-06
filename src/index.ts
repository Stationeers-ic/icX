import {parseModule, Program} from 'esprima';
import {Directive, ModuleDeclaration, Statement} from "estree";
import {Vars} from "./Storages/Vars";
import {Err, Errors} from "./Exceptions/Err";
import {uses} from "./types";
import PProgram from "./Parsers/Program"
import { ExecutionStorage } from "./Storages/ExecutionStorage"


export class IcX {
    public lines: string[] = [];
    public vars = new Vars(this)
    public use = new Set<uses>()
    public errors = Errors.getInstance()

    public program: Program;

    constructor(code: string) {
        this.program = parseModule(code, {comment: true, loc: true, tolerant: true})
    }

    run() {
        const ic10 = this.compile()
        console.log(this.errors.getUserMessage());
        return ic10
    }

    compile(): string {
        const compiler = new PProgram(this.program);
        compiler.process();
        console.dir(ExecutionStorage.lines, { depth: null });
        // this.lines = []
        // this.program.body.forEach((value, index, array) => {
        //     this.prepareItem(value, index, array)
        // })
        // return this.lines.join("\n")
        return ""
    }

    public prepareItem(value: (Directive | Statement | ModuleDeclaration), index: number, array: (Directive | Statement | ModuleDeclaration)[]) {

        // @ts-ignore
        // try {
        //     if (value['type'] === 'ExpressionStatement') {
        //         new PrepareFunctions(this, value, index, array)
        //     } else if (value['type'] === 'VariableDeclaration') {
        //         new PrepareVars(this, value, index, array)
        //     } else if (value['type'] === 'FunctionDeclaration') {
        //         new PrepareNewFunctions(this, value, index, array)
        //     } else if (value['type'] === 'WhileStatement') {
        //         new PrepareWhile(this, value, index, array)
        //     } else if (value['type'] === 'ImportDeclaration') {
        //         throw new Err(902, value.loc, 'Import, not supported')
        //     } else if (value['type'] === 'ExportNamedDeclaration') {
        //         throw new Err(902, value.loc, 'Export, not supported')
        //     } else if (value['type'] === 'ExportDefaultDeclaration') {
        //         throw new Err(902, value.loc, 'Export, not supported')
        //     } else if (value['type'] === 'ExportAllDeclaration') {
        //         throw new Err(902, value.loc, 'Export, not supported')
        //     } else if (value['type'] === 'ClassDeclaration') {
        //         throw new Err(902, value.loc, 'Class, not supported')
        //     }
        // } catch (e) {
        //     if (e instanceof Err) {
        //         this.errors.push(e)
        //     }
        // }
    }
}
