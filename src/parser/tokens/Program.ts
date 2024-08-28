import TOKEN_TYPES, { LexerToken, LexerTOKEN_TYPES, Token, TokenInterface } from "../tokens"
import { ERROR, ErrorListing } from "../errors"
import { getNextToken } from "../getNextToken"
import CodeBlock from "./CodeBlock"

export class Program extends Token implements TokenInterface {
	readonly type = TOKEN_TYPES.Program
	readonly start: number
	readonly end: number
	readonly length: number
	readonly isCodeBlock = false
	readonly parent: null = null
	readonly errors: ErrorListing[] = []
	readonly body: CodeBlock
	constructor(tokens: LexerToken[]) {
		super()
		this.start = 0
		this.end = tokens[tokens.length - 1].end
		this.length = this.end - this.start
		this.body = new CodeBlock(tokens, this)
		this.body.next = undefined
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
		// // cut till EOF token
		tokens = tokens.slice(0, index + 1)
		return new Program(tokens)
	}
}

export default Program
