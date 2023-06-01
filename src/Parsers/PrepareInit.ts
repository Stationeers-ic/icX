import {Prepare} from "./Prepare";
import {BinaryExpression, CallExpression} from "luaparse";

export class PrepareInit extends Prepare {
    declare protected Element: CallExpression | BinaryExpression  | null;
    private value: any = undefined;

    run(): void {
        if (!this.Element) {
            return;
        }
        switch (this.Element.type) {
            case "BinaryExpression":
                break;
            case "CallExpression":
                break;

        }
    }

    get() {
        this.run()
        return this.value
    }

}
