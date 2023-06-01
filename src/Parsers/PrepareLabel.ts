import {Prepare} from "./Prepare";
import {Variable} from "../Language/Variable";
import * as lua from "luaparse";

export class PrepareLabel extends Prepare {
    declare protected Element: lua.LabelStatement

    run(): void {
        const name = this.Element.label.name
        this.compile(name)
    }

    compile(name:string): void {
        this.addLine(`${name}:`)
    }
}
