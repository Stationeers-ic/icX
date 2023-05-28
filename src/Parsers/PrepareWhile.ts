import {Prepare} from "./Prepare";
import {WhileStatement} from "estree";

export class PrepareWhile extends Prepare {
    declare protected Element: WhileStatement;

    run(): void {
        if (this.Element.body.type === 'BlockStatement') {
            this.Element.body.body.forEach((value, index, array) => {
                this.scope.prepareItem(value, index, array)
            })
        }
    }

}
