import {Prepare} from "./Prepare";
import {Identifier, VariableDeclaration} from "estree";

export class PrepareVars extends Prepare {
    declare protected Element: VariableDeclaration;

    run(): void {
        this.Element.declarations.forEach(item => {
            const id = item.id as Identifier;
            this.scope.vars.add()
        })
        console.log(id.name)
    }


}
