import { TOKENS, TOKEN_TYPES } from "./tokens"

const text = `{false: 12, "hello": "hui"}`

type Token = {
	type: TOKEN_TYPES
	start: number
	end: number
	length: number
	value?: string
}

//name function
function getNextToken(
	index: number,
	text: string,
): [length: number, Omit<Token, "start" | "end" | "length">] | undefined {
	for (const token of TOKENS) {
		if (token.patternType === "string") {
			if (token.pattern.length === 1 && text[index] === token.pattern) {
				return [1, { type: token.token }]
			}

			if (text.startsWith(token.pattern, index)) {
				return [token.pattern.length, { type: token.token }]
			}
		}
	}
}

function parse(text: string) {
	let index = 0
	const tokens: Token[] = []
	while (index < text.length) {
		if (text[index] === " " || text[index] === "\t" || text[index] === "\r" || text[index] === "\f") {
			index++
			continue
		}
		const start = index
		const nextToken = getNextToken(index, text)
		if (!nextToken) {
			index++
			continue
		}
		index += nextToken[0]
		const next: Token = {
			...nextToken[1],
			start: start,
			end: index,
			length: index - start,
		}

		tokens.push(next)
	}
	tokens.push({ type: TOKEN_TYPES.EOF, start: index, end: index, length: 0 })
	return tokens
}

console.log(parse(text))
