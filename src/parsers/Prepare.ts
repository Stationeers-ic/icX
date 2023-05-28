import {Directive, ModuleDeclaration, Statement} from "estree";
import {IcX} from "../index";

export abstract class Prepare {
    protected Element: any
    constructor(protected scope: IcX, Element: (Directive | Statement | ModuleDeclaration), protected index: number, protected array: (Directive | Statement | ModuleDeclaration)[]) {
        this.Element = Element
        this.run()
    }
    abstract run(): void;
}

