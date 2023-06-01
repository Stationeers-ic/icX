import {Vars} from "./Storages/Vars";
import {Err, Errors} from "./Exceptions/Err";
import {uses} from "./types";
import * as lua from "luaparse"
import {Chunk} from "luaparse/lib/ast";


export class IcX {
    public lines: string[] = [];
    public vars = new Vars(this)
    public use = new Set<uses>()
    public errors = new Errors()
    public program: Chunk;

    constructor(code: string) {
        this.program = lua.parse(code,{locations:true})
    }

    run() {
        const ic10 = this.compile()
        if (this.errors.isError()) {
            console.log(this.errors.getUserMessage())
        }
        return ic10
    }

    compile(): string {
        this.lines = []
        this.program.body.forEach((value, index, array) => {
            this.prepareItem(value, index, array)
        })
        return this.lines.join("\n")
    }

    public prepareItem(value: lua.Statement, index: number, array: lua.Statement[]) {
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
