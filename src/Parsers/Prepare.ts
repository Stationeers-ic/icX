import {Directive, Expression, ExpressionMap, ModuleDeclaration, Statement} from "estree";
import {IcX} from "../index";
import {uses} from "../types";

export abstract class Prepare {
    protected Element: any

    constructor(protected scope: IcX, Element: (Directive | Statement | ModuleDeclaration | ExpressionMap | Expression), protected index: number, protected array?: (Directive | Statement | ModuleDeclaration)[]) {
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

