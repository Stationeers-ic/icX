import TOKEN_TYPES, { LexerToken, LexerTOKEN_TYPES, lexerBrakeTokens, Token, TokenInterface } from "../tokens"
import { createTokenError, ERROR, ErrorListing } from "../errors"
import AssignmentBlock from "./AssignmentBlock"

export class Identifier extends Token implements TokenInterface {
	readonly type = TOKEN_TYPES.Identifier
	readonly start: number
	readonly end: number
	readonly length: number
	readonly parent: TokenInterface | null
	readonly errors: ErrorListing[]
	readonly isCodeBlock: false = false
	readonly variables: undefined
	readonly constants: undefined
	readonly name: string
	constructor(token: LexerToken, parent: TokenInterface) {
		super()
		this.start = token?.start ?? -1
		this.end = token?.end ?? -1
		this.length = this.end - this.start
		this.parent = parent
		this.errors = parent.errors
		this.name = token.value
	}
	static is(token: TokenInterface | null): token is Identifier {
		if (token === null) return false
		return token.type === TOKEN_TYPES.Identifier
	}
	static parse(tokens: LexerToken[], parent: TokenInterface): [TokenInterface, LexerToken[]] | null {
		const token = tokens[0]
		if (token.type !== LexerTOKEN_TYPES.IDENTIFIER) throw ERROR.InvalidToken
		if (tokens[1]?.type === LexerTOKEN_TYPES.ASSIGNMENT) {
			return AssignmentBlock.parse(tokens, parent)
		}
		const other = tokens.slice(1)
		const newToken = new Identifier(token, parent)
		return [newToken, other]
	}
}

export default Identifier
