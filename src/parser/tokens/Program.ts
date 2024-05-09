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
	readonly variables: {} = {}
	readonly constants: {} = {}
	readonly errors: ErrorListing[] = []
	readonly body: Token[] = []
	constructor(tokens: LexerToken[]) {
		super()
		this.start = 0
		this.end = tokens[tokens.length - 1].end
		this.length = this.end - this.start
		let result: [TokenInterface | null, LexerToken[]] | null = null
		while ((result = getNextToken(tokens, this)) !== null) {
			// x is next token
			const x = result[0]
			// tokens are remaining
			tokens = result[1]
			// push to body
			if (x !== null) this.body.push(x)
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
		// cut till EOF token
		tokens = tokens.slice(0, index + 1)
		return new Program(tokens)
	}
}

export default Program
