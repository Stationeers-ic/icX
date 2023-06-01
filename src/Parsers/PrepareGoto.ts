import {Prepare} from "./Prepare";
import {Variable} from "../Language/Variable";
import * as lua from "luaparse";

export class PrepareGoto extends Prepare {
    declare protected Element: lua.GotoStatement

    run(): void {
        const name = this.Element.label.name
        this.compile(name)
    }

    compile(name:string): void {
        this.addLine(`j ${name}`)
    }
}
