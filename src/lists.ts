import {Err} from "./err"

export type uses = 'aliases' | 'comments' | 'loop' | 'constants' | string | any

export class variable {
	temp: boolean
	to: string
	from: string
	ready: boolean    = true
	constant: boolean = false
	defaultValue: any;

	constructor(from: string, to: string, temp = false, constant = false) {
		this.temp     = temp
		this.to       = to
		this.from     = from
		this.constant = constant
	}

	release() {
		this.ready = true
		return this
	}

	get() {
		this.ready = false
		return this
	}

	toString(n: boolean = true) {
		if (this.constant) {
			if (use.has('constants')) {
				return this.from
			} else {
				return this.to
			}
		}
		if (use.has("aliases") && !this.temp && n) return this.from
		else return this.to
	}
}

export class devices extends variable {
	constructor(from: string, to: string, temp = false, constant = false) {
		super(from, to, temp, constant)
		this.temp     = false
		this.to       = to
		this.from     = from
		this.constant = true
	}

	get() {
		this.ready = true
		return this
	}
}

export class varsClass {
	aliases: variable[] = []
	temps: variable[]   = []
	empty: string[]     = []

	constructor() {
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
		this.aliases.push(new variable('sp', 'r16'))
		this.aliases.push(new variable('ra', 'r17'))
	}

	set(from: string, temp = false) {
		var result
		if (!/^[a-zA-Z_]\w*/.test(from))
			//TODO             ↓
			throw new Err(205, 0, from, '')
		if (this.exists(from))
			//TODO             ↓
			throw new Err(204, 0, from, '')
		else
			result = new variable(from, this.empty.shift() ?? "null", temp)
		this.aliases.push(result)
		return result
	}

	setDevice(from: string, to: string) {
		var result = new devices(from, to, false)
		this.aliases.push(result)
		return result
	}

	setCustom(from: string, to: number | string, temp = false, constant = false) {
		let result;
		if (!/^[a-zA-Z_]\w*/.test(from))
			//TODO             ↓
			throw new Err(205, 0, from, '')
		if (this.exists(from))
			//TODO             ↓
			throw new Err(204, 0, from, '')
		else
			result = new variable(from, String(to), temp, constant)
		this.aliases.push(result)
		return result
	}

	exists(from: string) {
		let found: boolean | variable | undefined = false;

		found = this.aliases.find((variable) => from === variable.from)
		if (!found) {
			found = this.temps.find((variable) => from === variable.from)
		}
		return !!found
	}

	find(from: string): false | variable {
		let found: boolean | variable | undefined = false;

		found = this.aliases.find((variable) => from === variable.from)
		if (!found) {
			found = this.temps.find((variable) => from === variable.from)
		}
		return found || false
	}

	get(from: string | variable, n: boolean = true): string {
		if (from instanceof variable) return from.toString()
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

	getTemp(): variable {
		let found: undefined | variable;
		this.temps.forEach(function (variable) {
			if (variable.ready) {
				found = variable
			}
		})
		if (found === undefined) return this.newTemp().get()
		return found.get()

	}

	private newTemp() {
		const newTemp = new variable("", this.empty.pop() ?? "null", true)
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

let vars = new varsClass
export {vars}
export const whiles: { count: number; reset: () => void; get: () => string }                               = {
	count: 0,
	reset: function () {
		this.count = 0
	},
	get  : function () {
		return 'while' + this.count++
	}
}
export const ifs: { count: number; reset: () => void; get: () => string }                                  = {
	count: 0,
	reset: function () {
		this.count = 0
	},
	get  : function () {
		return 'if' + this.count++
	}

}
export const functions: { fn: string[]; add: (str: string) => void; get: () => string; reset: () => void } = {
	fn   : [],
	add  : function (str) {
		this.fn.push(str)
	},
	get  : function () {
		return this.fn.join('\n')
	},
	reset: function () {
		this.fn = []
	}
}
export const use                                                                                           = {
	arg   : new Set(),
	add   : function (str: uses) {
		this.arg.add(str)
	},
	delete: function (str: uses) {
		this.arg.delete(str)
	},
	has   : function (str: uses) {
		return this.arg.has(str);
	},
	reset : function () {
		this.arg = new Set()
	}
}
