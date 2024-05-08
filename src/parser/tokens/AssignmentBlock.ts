import TOKEN_TYPES, { LexerToken, LexerTOKEN_TYPES, lexerBrakeTokens, lexerSeparatorTokens, Token, TokenInterface } from "../tokens"
import { createTokenError, ERROR, ErrorListing } from "../errors"
import { getNextToken } from "../getNextToken"
import { getDefault } from "../helpers"
import VariableAssignment from "./VariableAssignment"

export class AssignmentBlock extends Token implements TokenInterface {
	readonly type = TOKEN_TYPES.AssignmentBlock
	readonly start: number
	readonly end: number
	readonly length: number
	readonly parent: TokenInterface | null
	readonly errors: ErrorListing[]
	readonly isCodeBlock: false = false
	readonly variables: undefined
	readonly constants: undefined
	readonly assignments: VariableAssignment[] = []
	constructor(tokens: LexerToken[], parent: TokenInterface) {
		super()
		this.start = tokens[0]?.start ?? -1
		this.end = tokens[tokens.length - 1]?.end ?? -1
		this.length = this.end - this.start
		this.parent = parent
		this.errors = parent.errors
		let nextSeparator = VariableAssignment.parse(tokens, this)
		while (nextSeparator !== null) {
			const result = nextSeparator[0]
			if (!VariableAssignment.is(result)) throw new Error("Invalid assignment")
			this.assignments.push(result)
			nextSeparator = VariableAssignment.parse(nextSeparator[1], this)
		}
	}
	private getValue(next: LexerToken[]): TokenInterface | null {
		if (next.length === 0) return null
		if (next[0].type !== LexerTOKEN_TYPES.ASSIGNMENT) return null
		next = next.slice(1)
		const result = getNextToken(next, this)
		if (result === null) return null
		result[1].forEach((x) => this.errors.push(createTokenError(ERROR.UnexpectedToken, x)))
		return result[0]
	}
	static is(token: TokenInterface | null): token is AssignmentBlock {
		if (token === null) return false
		return token.type === TOKEN_TYPES.AssignmentBlock
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
			tokens.findIndex((v) => v.type in lexerBrakeTokens),
			tokens.length,
		)
		const included = tokens.slice(0, index)
		const other = tokens.slice(index)
		const newToken = new AssignmentBlock(included, parent)
		return [newToken, other]
	}
}

export default AssignmentBlock
