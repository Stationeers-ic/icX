import { parse } from "../lexer"
import Program from "./tokens/Program"




const code = `x()`
console.log(parse(code))
console.log("____________")
const p = Program.parseProgram(parse(code)[0])
// console.log(p)
console.log(p.errors)
console.log(JSON.stringify(p.body, (key, value) => (key === "parent" || key === "errors" ? undefined : value), 2))


