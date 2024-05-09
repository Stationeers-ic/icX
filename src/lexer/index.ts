import extractTextBetween from "./textBetween"
import { TOKENS, TOKEN_TYPES } from "./tokens"

const text = `x ="hello"`
export { TOKEN_TYPES }
export type Token<T = TOKEN_TYPES, V = any> = {
	type: T
	start: number
	end: number
	length: number
	value?: V
}

//name function
export function getNextToken(
	index: number,
	text: string,
): [length: number, Omit<Token, "start" | "end" | "length">, error?: Token[]] | undefined {
	for (const token of TOKENS) {
		if (token.patternType === "string") {
			if (token.pattern.length === 1 && text[index] === token.pattern) {
				return [1, { type: token.token }]
			} else if (text.startsWith(token.pattern, index)) {
				if (/^\W/.exec(text.slice(index + token.pattern.length)))
					return [token.pattern.length, { type: token.token }]
			}
		} else if (token.patternType === "range") {
			const [len, error] = extractTextBetween(index, text, token.open, token.close, token.ignore, token.errorOn)
			if (error === true) continue
			if (typeof error === "string") {
				return [
					len,
					{
						type: token.token,
						value: text.slice(index + token.open.length, index + len),
					},
					[{ type: TOKEN_TYPES.ERROR, start: index + len, end: index + len, length: 0, value: error }],
				]
			}
			if (error === false) {
				return [
					len,
					{
						type: token.token,
						value: text.slice(index + token.open.length, index + len - token.close.length),
					},
				]
			}
		} else if (token.patternType === "function") {
			const result = token.pattern(index, text)
			if (result === null) continue
			return [result[0], { type: token.token, value: result[1] }]
		}
	}
}
// console.log(extractTextBetween(1, "1'word\\'end'd", "'", "'", ["\\'"], ["\n"]))
export function parse(text: string) {
	// add EOF (ETX) to properly generate last token and add EOF token
	text += "\u0003"
	let index = 0
	const tokens: Token[] = []
	const errors: Token[] = []
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
		if (next.type === TOKEN_TYPES.EOF) {
			next.end = next.start
			next.length = 0
			break
		}
		const err = nextToken[2]
		if (err) errors.push(...err)
	}
	return [tokens, errors]
}
