import extractTextBetween from "./extractTextBetween"
import { TOKEN_TYPES, TOKENS } from "./tokens"

export type Token<T extends TOKEN_TYPES = TOKEN_TYPES> = {
	type: T
	start: number
	end: number
	length: number
	value?: string
}
type errorToken = Token<"ERROR">
type unknownToken = Token<"UNKNOWN">
export type CODE_TOKEN = Token<Exclude<TOKEN_TYPES, "ERROR" | "UNKNOWN">>
export type ERROR_TOKEN = errorToken | unknownToken

type createTokenReturn = [length: number, Omit<CODE_TOKEN, "start" | "end" | "length">, error?: errorToken[]]
function createToken(
	length: number,
	type: Exclude<TOKEN_TYPES, "ERROR" | "UNKNOWN">,
	value: string | undefined,
	index?: number,
	errors?: string[],
): createTokenReturn {
	const token: Omit<CODE_TOKEN, "start" | "end" | "length"> = {
		type,
		value,
	}
	const errorTokens: errorToken[] = []
	if (errors && index !== undefined && errors.length > 0) {
		for (const error of errors) {
			errorTokens.push({
				type: TOKEN_TYPES.ERROR,
				start: index,
				end: index + length,
				length: length,
				value: error,
			})
		}
	}
	if (errorTokens.length === 0) return [length, token]
	return [length, token, errorTokens]
}

export function getNextToken(
	substr: string,
	firstOnLine: boolean = false,
	index: number,
): createTokenReturn | undefined {
	// Check for newline first, before extracting candidate
	if (substr[0] === "\n") {
		return createToken(1, TOKEN_TYPES.NEWLINE, "\n")
	}
	// get string to next whitespace
	const nextWhitespace = substr.search(/\s/)
	const endIndex = nextWhitespace === -1 ? substr.length : nextWhitespace
	const candidate = substr.slice(0, endIndex)
	for (const token of TOKENS) {
		if (token.firstInLine !== null && token.firstInLine !== firstOnLine) continue

		if (token.patternType === "string") {
			const patterns = Array.isArray(token.pattern) ? token.pattern : [token.pattern]
			for (const pattern of patterns)
				if (typeof pattern === "string") {
					if (candidate === pattern) return createToken(pattern.length, token.token, candidate)
				} else {
					const match = candidate.match(pattern)
					if (match && match[0] === candidate) return createToken(candidate.length, token.token, candidate)
				}
			continue
		}

		if (token.patternType === "range") {
			const [length, error] = extractTextBetween(substr, token.open, token.close, token.ignore, token.errorOn)
			if (error === true) continue
			if (typeof error === "string")
				return createToken(length, token.token, substr.slice(0, length), index, [error])
			return createToken(length, token.token, substr.slice(0, length))
		}

		if (token.patternType === "function") {
			const result = token.pattern(substr)
			if (result === null) continue
			const [length, value, error] = result
			if (error) return createToken(length, token.token, value, index, [error])
			return createToken(length, token.token, value, index)
		}
	}
}
export function parse(text: string): { tokens: CODE_TOKEN[]; errors: ERROR_TOKEN[] } {
	text += "\n\u0003"
	let index = 0
	const tokens: CODE_TOKEN[] = []
	const errors: ERROR_TOKEN[] = []
	let firstOnLine = true
	while (index < text.length) {
		const substr = text.slice(index)
		const skip = substr.search(/[^\r\t\f ]/)
		if (skip > 0) {
			index += skip
			continue
		}
		const result = getNextToken(substr, firstOnLine, index)
		if (!result) {
			errors.push({
				type: TOKEN_TYPES.UNKNOWN,
				start: index,
				end: index + 1,
				length: 1,
				value: `Unexpected character: "${substr[0]}"`,
			})
			index += 1
			continue
		}
		const [length, token, errorTokens] = result
		let correctLengthBy = 0
		if (token.type === TOKEN_TYPES.NEWLINE) firstOnLine = true
		else if (token.type === TOKEN_TYPES.COMMENT) {
			// remove last newline from comment token if present
			if (token.value && token.value.endsWith("\n")) {
				token.value = token.value.slice(0, -1)
				correctLengthBy -= 1
			}
		} else firstOnLine = false
		tokens.push({
			...token,
			start: index,
			end: index + length + correctLengthBy,
			length: length + correctLengthBy,
		})
		if (errorTokens) errors.push(...errorTokens)
		index += length + correctLengthBy
	}
	return { tokens, errors }
}
export default parse
