import { parse } from "../lexer"
import Program from "./tokens/Program"

const code = `x(5+x(5*5,x,x,x), 5+5)`
const l  = parse(code)
console.log(l)
console.log("____________")
const p = Program.parseProgram(l[0])

// console.log(p)
console.log(p.errors)
console.log(
	JSON.stringify(
		p.body,
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
