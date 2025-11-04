import type { CODE_TOKEN } from "@/lexer"
import type { ErrorMessage } from "./Types"
import { BreakNode } from "./BreakNode"
import { TOKEN_TYPES } from "@/lexer/tokens"

export type ParseParams = {
	tokens: CODE_TOKEN[]
	errors: ErrorMessage[]
	fromStart: TOKEN_TYPES[]
	allowedTokens: TOKEN_TYPES[]
	count: number
}
export type ParseResult = {
	fromStart: CODE_TOKEN[]
	allowedTokens: CODE_TOKEN[]
	remainingTokens: CODE_TOKEN[]
	erroredTokens: CODE_TOKEN[]
	comment: string | null
}
export function parse({tokens, errors, allowedTokens, count, fromStart}: ParseParams): null | ParseResult {
	// from tokens find fromStart tokens, then allowedTokens, up to count
	// collect comment at the end if present, mark all unexpected tokens as errors, consume newline
	const result: ParseResult = {
		fromStart: [],
		allowedTokens: [],
		remainingTokens: [],
		erroredTokens: [],
		comment: null,
	}
	let i = 0
	// fromStart
	for (; i < tokens.length && result.fromStart.length < fromStart.length; i++) {
		if (tokens[i].type === fromStart[result.fromStart.length]) {
			result.fromStart.push(tokens[i])
		} else {
			// add to erroredTokens except comments or newlines
			if (tokens[i].type !== TOKEN_TYPES.COMMENT && tokens[i].type !== TOKEN_TYPES.NEWLINE)
				break
			result.erroredTokens.push(tokens[i])
		}
	}
	if (result.fromStart.length < fromStart.length) {
		return null
	}
	// any of allowedTokens up to count times, -1 means unlimite
	for (; i < tokens.length && (count === -1 || result.allowedTokens.length < count); i++) {
		if (allowedTokens.includes(tokens[i].type)) {
			result.allowedTokens.push(tokens[i])
		} else {
			// add to erroredTokens except comments or newlines
			if (tokens[i].type !== TOKEN_TYPES.COMMENT && tokens[i].type !== TOKEN_TYPES.NEWLINE)
				break
			result.erroredTokens.push(tokens[i])
		}
	}
	// comment and newline can only be once
	if (i < tokens.length && tokens[i].type === TOKEN_TYPES.COMMENT) {
		result.comment = tokens[i].value ?? null
		i++
	}
	if (i < tokens.length && tokens[i].type === TOKEN_TYPES.NEWLINE) {
		i++
	}
	result.remainingTokens = tokens.slice(i)
}
