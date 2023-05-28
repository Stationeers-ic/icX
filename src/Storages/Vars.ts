import {Variable} from "./Variable";
import {IcX} from "../index";
import {Err} from "../Exceptions/Err";
import {Devices} from "./Devices";

export class Vars {
    aliases: Variable[] = []
    temps: Variable[] = []
    empty: string[] = []

    constructor(public scope: IcX) {
        this.reset()
    }

    reset() {
        this.temps = []
        this.empty = []
        for (let i = 0; i <= 15; i++) {
            this.empty.push("r" + i)
        }
        this.resetAliases()
    }

    resetAliases() {
        this.aliases = []
        this.aliases.push(new Variable(this.scope, 'sp', 'r16'))
        this.aliases.push(new Variable(this.scope, 'ra', 'r17'))
    }

    set(from: string, initValue?:any, temp = false) {
        let result:Variable;
        if (!/^[a-zA-Z_]\w*/.test(from))
            //TODO             ↓
            throw new Err(205, null, from, '')
        if (this.exists(from))
            //TODO             ↓
            throw new Err(204, null, from, '')
        else
            result = new Variable(this.scope, from, this.empty.shift() ?? "null", temp)

        result.initValue = initValue
        this.aliases.push(result)
        return result
    }

    setDevice(from: string, to: string) {
        const result = new Devices(this.scope, from, to, false);
        this.aliases.push(result)
        return result
    }

    setCustom(from: string, to: number | string, temp = false, constant = false) {
        let result;
        if (!/^[a-zA-Z_]\w*/.test(from))
            //TODO             ↓
            throw new Err(205, null, from, '')
        if (this.exists(from))
            //TODO             ↓
            throw new Err(204, null, from, '')
        else
            result = new Variable(this.scope, from, String(to), temp, constant)
        this.aliases.push(result)
        return result
    }

    exists(from: string) {
        let found: boolean | Variable | undefined = false;

        found = this.aliases.find((Variable) => from === Variable.from)
        if (!found) {
            found = this.temps.find((Variable) => from === Variable.from)
        }
        return !!found
    }

    find(from: string): false | Variable {
        let found: boolean | Variable | undefined = false;

        found = this.aliases.find((Variable) => from === Variable.from)
        if (!found) {
            found = this.temps.find((Variable) => from === Variable.from)
        }
        return found || false
    }

    get(from: string | Variable, n: boolean = true): string {
        if (from instanceof Variable) return from.toString()
        const re = /d\[(\w+)\]/;
        if (re.test(from)) {
            const a = re.exec(from);
            if (a != null) {
                return 'd' + this.get(a[1], false)
            }
        }
        const find = this.find(from)
        if (find === false) return from
        return find.toString(n)
    }

    getTemp(): Variable {
        let found: undefined | Variable;
        this.temps.forEach(function (Variable) {
            if (Variable.ready) {
                found = Variable
            }
        })
        if (found === undefined) return this.newTemp().get()
        return found.get()

    }

    private newTemp() {
        const newTemp = new Variable(this.scope, "", this.empty.pop() ?? "null", true)
        this.temps.unshift(newTemp)
        return newTemp
    }

    getAliases() {
        let txt = '';
        for (const aliasesKey in this.aliases) {
            if (!this.aliases[aliasesKey].temp && !this.aliases[aliasesKey].constant) {
                if (this.aliases[aliasesKey].from == 'sp' || this.aliases[aliasesKey].from == 'ra') {
                    continue
                }
                txt += `alias ${this.aliases[aliasesKey].from} ${this.aliases[aliasesKey].to}\n`
            }
        }
        return txt
    }
}
