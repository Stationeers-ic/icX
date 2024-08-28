console.log("____________")
import { parse } from "../lexer"
import Program from "./tokens/Program"

const code = `1+1
{2+2}`
const l = parse(code)
console.log(l)
console.log("____________")
const p = Program.parseProgram(l[0])

// console.log(p)
console.log(p.errors)
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
