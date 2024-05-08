import TOKEN_TYPES, { LexerToken, LexerTOKEN_TYPES, Token, TokenInterface } from "../tokens"
import { ERROR, ErrorListing } from "../errors"
import { getNextToken } from "../getNextToken"

export class Program extends Token implements TokenInterface {
	readonly type = TOKEN_TYPES.Program
	readonly start: number
	readonly end: number
	readonly length: number
	readonly isCodeBlock = true
	readonly parent: null = null
	variables: {} = {}
	constants: {} = {}
	errors: ErrorListing[] = []
	body: Token[] = []
	constructor(tokens: LexerToken[]) {
		super()
		this.start = 0
		this.end = tokens[tokens.length - 1].end
		this.length = this.end - this.start
		let result = getNextToken(tokens, this)
		while (result !== null) {
			const x = result[0]
			if (x !== null) this.body.push(x)
			result = getNextToken(result[1], this)
		}
	}
	static is(token: TokenInterface | null): token is Program {
		if (token === null) return false
		return token.type === TOKEN_TYPES.Program
	}
	static parse(): [TokenInterface, LexerToken[]] {
		throw new Error("Method not implemented in Program Token")
	}
	static parseProgram(tokens: LexerToken[]): Program {
		// find EOF token
		const index = tokens.findIndex((token) => token.type === LexerTOKEN_TYPES.EOF)
		if (index === -1) throw ERROR.MissingEOFToken
		tokens = tokens.slice(0, index + 1)
		return new Program(tokens)
	}
}

export default Program
