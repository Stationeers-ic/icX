import {IcX} from "../index";
import {uses} from "../types";
import * as lua from "luaparse";

export abstract class Prepare {
    protected Element: any

    constructor(protected scope: IcX, Element: lua.Statement, protected index: number, protected array?: lua.Statement[]) {
        this.Element = Element
        this.run()
    }

    abstract run(): void;

    addLine(line: string) {
        this.scope.lines.push(line)
        return this;
    }

    use(key: uses):key is uses{
        return this.scope.use.has(key)
    }
}

