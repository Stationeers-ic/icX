import {Prepare} from "./Prepare";
import {BinaryExpression, CallExpression, Literal} from "estree";

export class PrepareInit extends Prepare {
    declare protected Element: CallExpression | BinaryExpression | Literal | null;
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
            case "Literal":
                this.value = this.Element.value
                return;
        }
    }

    get() {
        this.run()
        return this.value
    }

}
