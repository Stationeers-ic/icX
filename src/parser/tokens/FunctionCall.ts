import TOKEN_TYPES, {
	LexerToken,
	LexerTOKEN_TYPES,
	lexerBrakeTokens,
	lexerSeparatorTokens,
	Token,
	TokenInterface,
} from "../tokens"
import { createTokenError, ERROR, ErrorListing } from "../errors"
import { getNextToken } from "../getNextToken"
import Identifier from "./Identifier"

export class FunctionCall extends Token implements TokenInterface {
	readonly type = TOKEN_TYPES.FunctionCall
	readonly start: number
	readonly end: number
	readonly length: number
	readonly parent: TokenInterface | null
	readonly errors: ErrorListing[]
	readonly isCodeBlock: false = false
	readonly variables: undefined
	readonly constants: undefined
	readonly id: Identifier
	readonly arguments: TokenInterface[] = []
	constructor(tokens: LexerToken[], parent: TokenInterface) {
		super()
		this.start = tokens[0]?.start ?? -1
		this.end = tokens[tokens.length - 1].end ?? -1
		this.length = this.end - this.start
		this.parent = parent
		this.errors = parent.errors
		const [first, ...rest] = tokens
		if (first.type !== LexerTOKEN_TYPES.IDENTIFIER) throw ERROR.InvalidToken
		const result = Identifier.parse([first], this)?.[0]
		if (result === undefined || !Identifier.is(result)) throw ERROR.InvalidToken
		this.id = result
	}
	private getInit(next: LexerToken[]): TokenInterface | null {
		if (next.length === 0) return null
		if (next[0].type !== LexerTOKEN_TYPES.ASSIGNMENT) return null
		next = next.slice(1)
		const result = getNextToken(next, this)
		if (result === null) return null
		result[1].forEach((x) => this.errors.push(createTokenError(ERROR.UnexpectedToken, x)))
		return result[0]
	}
	static is(token: TokenInterface | null): token is FunctionCall {
		if (token === null) return false
		return token.type === TOKEN_TYPES.FunctionCall
	}
	static parse(tokens: LexerToken[], parent: TokenInterface): [TokenInterface, LexerToken[]] | null {
		while (tokens[0]?.type in lexerSeparatorTokens && tokens.length > 0) tokens = tokens.slice(1)
		if (tokens.length === 0) return null
		const token = tokens[0]
		if (token.type !== LexerTOKEN_TYPES.IDENTIFIER) return null
		// find end
		let index = 0
		while (!(tokens[index]?.type in lexerSeparatorTokens) && index < tokens.length) index++
		const after = tokens.slice(0, index)
		const other = tokens.slice(index)
		const newToken = new FunctionCall(after, parent)
		return [newToken, other]
	}
}

export default FunctionCall
