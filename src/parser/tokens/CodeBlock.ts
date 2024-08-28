import TOKEN_TYPES, { LexerToken, LexerTOKEN_TYPES, Token, TokenInterface } from "../tokens"
import { ERROR, ErrorListing } from "../errors"
import { getNextToken } from "../getNextToken"

export class CodeBlock extends Token implements TokenInterface {
	readonly type = TOKEN_TYPES.CodeBlock
	readonly start: number
	readonly end: number
	readonly length: number
	readonly isCodeBlock = true
	readonly parent: TokenInterface | null
	readonly variables: {} = {}
	readonly constants: {} = {}
	readonly errors: ErrorListing[] = []
	readonly body: Token[] = []
	next: LexerToken[] | undefined
	constructor(tokens: LexerToken[], parent: TokenInterface) {
		super()
		this.start = tokens[0]?.start ?? -1
		this.end = tokens[tokens.length - 1].end
		this.length = this.end - this.start
		this.parent = parent
		let result: [TokenInterface | null, LexerToken[]] | null = null
		while ((result = getNextToken(tokens, this)) !== null) {
			// x is next token
			const x = result[0]
			// tokens are remaining
			tokens = result[1]

			// push to body
			if (x !== null) this.body.push(x)
		}
		this.next = tokens
	}
	static is(token: TokenInterface | null): token is CodeBlock {
		if (token === null) return false
		return token.type === TOKEN_TYPES.CodeBlock
	}
	static parse(tokens: LexerToken[], parent: TokenInterface): [TokenInterface, LexerToken[]] {
		const token = tokens.shift()
		if (token?.type !== LexerTOKEN_TYPES.LEFT_BRACE) throw ERROR.InvalidToken
		const newToken = new CodeBlock(tokens, parent)
		const result = newToken.next ?? []
		newToken.next = undefined
		result.shift()
		return [newToken, result]
	}
}

export default CodeBlock
