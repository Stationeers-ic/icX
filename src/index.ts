import parse from "@lexer"
import createTree from "./ast/index"

const input = `break hello #comment
continue
return 42
funciton hello arg1 arg2 do
add x arg1 arg2
end
`

const lexer = parse(input)
console.log(JSON.stringify(lexer, null, 2))

const { ast, errors } = createTree(lexer.tokens)
console.log(JSON.stringify(ast, null, 2))
console.log(JSON.stringify(errors, null, 2))
