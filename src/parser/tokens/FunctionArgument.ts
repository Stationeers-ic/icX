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
import { getDefault } from "../helpers"

export class FunctionArgument extends Token implements TokenInterface {
	readonly type = TOKEN_TYPES.FunctionArgument
	readonly start: number
	readonly end: number
	readonly length: number
	readonly parent: TokenInterface | null
	readonly errors: ErrorListing[]
	readonly isCodeBlock: false = false
	readonly variables: undefined
	readonly constants: undefined
	readonly argument: TokenInterface | null
	constructor(token: TokenInterface | null, parent: TokenInterface) {
		super()
		this.argument = token
		this.start = token?.start ?? -1
		this.end = token?.end ?? -1
		this.length = this.end - this.start
		this.parent = parent
		this.errors = parent.errors
	}
	static is(token: TokenInterface | null): token is FunctionArgument {
		if (token === null) return false
		return token.type === TOKEN_TYPES.FunctionArgument
	}
	static parse(tokens: LexerToken[], parent: TokenInterface): [FunctionArgument, LexerToken[]] | null {
		if (tokens.length === 0) return null
		const splitIndex = getDefault(
			tokens.findIndex((x) => x.type in lexerSeparatorTokens),
			tokens.length,
		)
		const other = tokens.slice(splitIndex)
		// other.forEach((x) => parent.errors.push(createTokenError(ERROR.UnexpectedToken, x)))
		const included = tokens.slice(0, splitIndex)
		const token = getNextToken(included, parent)
		if (token === null) return null
		const [t, next] = token
		next.forEach((x) => parent.errors.push(createTokenError(ERROR.UnexpectedToken, x)))
		return [new FunctionArgument(t, parent), other]
	}
}

export default FunctionArgument
