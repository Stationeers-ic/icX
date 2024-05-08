import TOKEN_TYPES, { LexerToken, LexerTOKEN_TYPES, lexerBrakeTokens, Token, TokenInterface } from "../tokens"
import { createTokenError, ERROR, ErrorListing } from "../errors"

export class NumberToken extends Token implements TokenInterface {
	readonly type = TOKEN_TYPES.NumberToken
	readonly start: number
	readonly end: number
	readonly length: number
	readonly parent: TokenInterface | null
	readonly errors: ErrorListing[]
	readonly isCodeBlock: false = false
	readonly variables: undefined
	readonly constants: undefined
	readonly value: number
	constructor(token: LexerToken, parent: TokenInterface) {
		super()
		this.start = token?.start ?? -1
		this.end = token?.end ?? -1
		this.length = this.end - this.start
		this.parent = parent
		this.errors = parent.errors
		this.value = token.value
	}
	static is(token: TokenInterface | null): token is NumberToken {
		if (token === null) return false
		return token.type === TOKEN_TYPES.NumberToken
	}
	static parse(tokens: LexerToken[], parent: TokenInterface): [NumberToken, LexerToken[]] {
		const token = tokens[0]
		if (token.type !== LexerTOKEN_TYPES.NUMBER) throw ERROR.InvalidToken

		const other = tokens.slice(1)
		const newToken = new NumberToken(token, parent)
		return [newToken, other]
	}
}

export default NumberToken
