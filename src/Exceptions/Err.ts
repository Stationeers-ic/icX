import ErrorCodes from "./errorCodes";
import { SourceLocation } from "estree";
import { Location } from "../types";

export function Throw(code: number, loc?: Location, ...params: (string | Location)[]) {
    const e = new Err(code, loc, ...params);
    Errors.getInstance().push(e);
    return e;
}
export default Throw;
export class Err {
    //  сторона ошибки      lvl        номер
    //      0                0           00
    static parse = 100; // ошибка в парсере
    static syntax = 200; // ошибка в коде пользователя
    static ic10 = 300; // ошибка в скомпилированном 1с10
    static math = 400; // ошибка в математике
    static other = 500; //
    static internal = 900; //
    public message: string = "";
    public code: number = 0;
    public line: number = -2;
    public lvl: string = "";
    public group: string = "";

    constructor(code: number, public loc: Location, ...params: (string | Location)[]) {
        this.code = code;
        if (this.code in ErrorCodes) {
            this.message = ErrorCodes[this.code];
        } else {
            this.message = "Unknown Error";
        }
        params.forEach((txt, i) => {
            this.message = this.message.replace(`{${i}}`, (txt ?? "null").toString());
        });
        if (this.loc) this.line = this.loc.start.line - 1;
        this.analyze();
    }

    analyze() {
        let c = 0;
        if (this.code >= Err.other) {
            c = this.code - Err.other;
            this.group = "Other";
        } else if (this.code >= Err.math) {
            c = this.code - Err.math;
            this.group = "Math";
        } else if (this.code >= Err.ic10) {
            c = this.code - Err.ic10;
            this.group = "ic10";
        } else if (this.code >= Err.syntax) {
            c = this.code - Err.syntax;
            this.group = "Syntax";
        } else if (this.code >= Err.parse) {
            c = this.code - Err.parse;
            this.group = "Parse";
        } else {
            this.group = "Other";
        }
        switch (String(c)[0]) {
            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
                this.lvl = "Fatal";
                break;
            case "7":
            case "8":
            case "9":
                this.lvl = "Info";
                break;
            default:
                this.lvl = "Other";
                break;
        }
    }

    getUserMessage() {
        return `[${this.code}:${this.group}${this.lvl}] ${this.loc?.source} ${this.loc?.start.line ?? -1}:${(this.loc?.start.column ?? 0) + 1}, ${this.message}`;
    }

    firstUpper(string: string): string {
        return string.toLowerCase().charAt(0).toUpperCase() + string.slice(1);
    }
}
// singleton
export class Errors {
    private static instance: Errors = new Errors();
    public e: Err[] = [];
    private constructor() {}
    static getInstance() {
        if (Errors.instance) return Errors.instance;
        Errors.instance = new Errors();
        return Errors.instance;
    }

    isError() {
        return this.e.length > 0;
    }

    push(e: Err) {
        this.e.push(e);
    }

    getUserMessage() {
        let msg = "";
        if (this.e.length == 0) return "No errors";
        for (const eKey in this.e) {
            msg += this.e[eKey].getUserMessage() + "\n";
        };
        // for (const eKey in this.e) {
        //     if (this.e[eKey] instanceof Err || this.e[eKey] instanceof Errors) {
        //         msg += this.e[eKey].getUserMessage() + "\n";
        //     } else {
        //         msg += JSON.stringify(this.e[eKey]) + "\n";
        //     }
        // }
        return msg;
    }
}
