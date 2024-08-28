export function compile(icx: string): string {
	return ""
}



import { parse } from "./lexer"
import { optimizeProgram } from "./optimizer"
import { parseProgram } from "./parser"

const code = `let x = (10 ** 2 << 2 > 1) * 100`
const l = parse(code)
console.log(l);
const p = parseProgram(l[0])
console.log(
	JSON.stringify(
		p,
		(key, value) =>
			key === "parent" ||
			key === "errors" ||
			key === "start" ||
			key === "end" ||
			key === "length" ||
			key === "isCodeBlock"
				? undefined
				: value,
		2,
	),
)
const o = optimizeProgram(p)

// console.log(p)

console.log("result",
	JSON.stringify(
		o,
		(key, value) =>
			key === "parent" ||
			key === "errors" ||
			key === "start" ||
			key === "end" ||
			key === "length" ||
			key === "isCodeBlock"
				? undefined
				: value,
		2,
	),
)
