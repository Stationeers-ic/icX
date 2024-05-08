import TOKEN_TYPES, { LexerToken, LexerTOKEN_TYPES, lexerBrakeTokens, Token, TokenInterface } from "../tokens"
import { createTokenError, ERROR, ErrorListing } from "../errors"

export class StringToken extends Token implements TokenInterface {
	readonly type = TOKEN_TYPES.StringToken
	readonly start: number
	readonly end: number
	readonly length: number
	readonly parent: TokenInterface | null
	readonly errors: ErrorListing[]
	readonly isCodeBlock: false = false
	readonly variables: undefined
	readonly constants: undefined
	readonly value: string
	constructor(token: LexerToken, parent: TokenInterface) {
		super()
		this.start = token?.start ?? -1
		this.end = token?.end ?? -1
		this.length = this.end - this.start
		this.parent = parent
		this.errors = parent.errors
		this.value = token.value
	}
	static is(token: TokenInterface | null): token is StringToken {
		if (token === null) return false
		return token.type === TOKEN_TYPES.StringToken
	}
	static parse(tokens: LexerToken[], parent: TokenInterface): [StringToken, LexerToken[]] {
		const token = tokens[0]
		if (token.type !== LexerTOKEN_TYPES.STRING) throw ERROR.InvalidToken

		const other = tokens.slice(1)
		const newToken = new StringToken(token, parent)
		return [newToken, other]
	}
}

export default StringToken
