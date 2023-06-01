import {Vars} from "./Language/Vars";
import {Err, Errors} from "./Exceptions/Err";
import {uses} from "./types";
import * as lua from "luaparse"
import {Chunk} from "luaparse/lib/ast";
import {PrepareVars} from "./Parsers/PrepareVars";
import {PrepareCallFunctions} from "./Parsers/PrepareCallFunctions";
import {PrepareGoto} from "./Parsers/PrepareGoto";
import {PrepareLabel} from "./Parsers/PrepareLabel";

export class IcX {
    public lines: string[] = [];
    public vars = new Vars(this)
    public use = new Set<uses>()
    public errors = new Errors()
    public program: Chunk;

    constructor(code: string) {
        this.program = lua.parse(code, {locations: true,luaVersion:"5.3",comments:true})
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
        try {
            switch (value['type']) {
                case "CallStatement":
                    new PrepareCallFunctions(this, value,index,array)
                    break;
                case "AssignmentStatement":
                case "LocalStatement":
                    new PrepareVars(this, value,index,array)
                    break;
                case "GotoStatement":
                    new PrepareGoto(this, value,index,array)
                    break;
                case "LabelStatement":
                    new PrepareLabel(this, value,index,array)
                    break;
                default:
                    throw new Err(902, value.loc, value['type'] + ', not supported');
            }
        } catch (e) {
            if (e instanceof Err) {
                this.errors.push(e)
            }
        }
    }
}
