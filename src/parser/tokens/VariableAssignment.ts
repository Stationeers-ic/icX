import TOKEN_TYPES, { lexerBrakeTokens, lexerSeparatorTokens, Token, TokenInterface } from "../tokens"
import { type Token as LexerToken, TOKEN_TYPES as LexerTOKEN_TYPES } from "../../lexer/"
import { createTokenError, ERROR, ErrorListing } from "../errors"
import { getNextToken } from "../getNextToken"
import Identifier from "./Identifier"
import { getDefault } from "../helpers"

export class VariableAssignment extends Token implements TokenInterface {
	readonly type = TOKEN_TYPES.VariableAssignment
	readonly start: number
	readonly end: number
	readonly length: number
	readonly parent: TokenInterface | null
	readonly errors: ErrorListing[]
	readonly isCodeBlock: false = false
	readonly variables: undefined
	readonly constants: undefined
	readonly id: Identifier
	readonly value: TokenInterface | null
	constructor(left: LexerToken, right: LexerToken[], parent: TokenInterface) {
		super()
		this.start = left?.start ?? -1
		this.end = right[right.length - 1]?.end ?? left.end
		this.length = this.end - this.start
		this.parent = parent
		this.errors = parent.errors
		if (left.type !== LexerTOKEN_TYPES.IDENTIFIER) throw ERROR.InvalidToken
		const result = Identifier.parse([left], this)?.[0]
		if (result === undefined || !Identifier.is(result)) throw ERROR.InvalidToken
		this.id = result
		this.value = this.getValue(right)
	}
	private getValue(next: LexerToken[]): TokenInterface | null {
		if (next.length === 0) {
			this.errors.push({ error: ERROR.NoToken, start: this.end, end: this.end })
			return null
		}
		const result = getNextToken(next, this)
		if (result === null) return null
		result[1].forEach((x) => this.errors.push(createTokenError(ERROR.UnexpectedToken, x)))
		return result[0]
	}
	static is(token: TokenInterface | null): token is VariableAssignment {
		if (token === null) return false
		return token.type === TOKEN_TYPES.VariableAssignment
	}
	static parse(tokens: LexerToken[], parent: TokenInterface): [TokenInterface, LexerToken[]] | null {
		if (tokens.length === 0) return null
		if (tokens[0].type !== LexerTOKEN_TYPES.IDENTIFIER) {
			parent.errors.push(createTokenError(ERROR.InvalidToken, tokens[0], LexerTOKEN_TYPES.IDENTIFIER))
			return null
		}
		if (tokens[1].type !== LexerTOKEN_TYPES.ASSIGNMENT) {
			parent.errors.push(createTokenError(ERROR.InvalidToken, tokens[1], LexerTOKEN_TYPES.ASSIGNMENT))
			return null
		}
		const index = getDefault(
			tokens.findIndex((v) => v.type in lexerSeparatorTokens),
			tokens.length,
		)
		const included = tokens.slice(0, index)
		const other = tokens.slice(index+1)

		const newToken = new VariableAssignment(included[0], included.slice(2), parent)
		return [newToken, other]
	}
}

export default VariableAssignment
