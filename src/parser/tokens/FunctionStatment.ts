import TOKEN_TYPES, {
	LexerToken,
	LexerTOKEN_TYPES,
	lexerBrakeTokens,
	lexerSeparatorTokens,
	Token,
	TokenInterface,
} from "../tokens"
import { createMissingError, createTokenError, ERROR, ErrorListing } from "../errors"
import { getNextToken } from "../getNextToken"
import Identifier from "./Identifier"
import FunctionArgument from "./FunctionArgument"

export class FunctionStatement extends Token implements TokenInterface {
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
	readonly body: TokenInterface[] = []
	constructor(token: LexerToken, arg: LexerToken[], parent: TokenInterface) {
		super()
		this.start = token.start
		this.end = arg[arg.length - 1].end ?? token.end
		this.length = this.end - this.start
		this.parent = parent
		this.errors = parent.errors
		const t = getNextToken([token], parent)
		if (t === null) throw new Error("FunctionCall: id is null")
		const id = t[0]
		if (!Identifier.is(id)) {
			if (id === null) this.errors.push(createMissingError(token.end, LexerTOKEN_TYPES.IDENTIFIER))
			else this.errors.push(createTokenError(ERROR.UnexpectedToken, token, LexerTOKEN_TYPES.IDENTIFIER))
			throw new Error("FunctionCall: id is not Identifier")
		}
		this.id = id
		const first = arg.shift() ?? null
		if (first === null) {
			this.errors.push(createMissingError(token.end, LexerTOKEN_TYPES.LEFT_PARENTHESIS))
			return
		}
		if (first.type !== LexerTOKEN_TYPES.LEFT_PARENTHESIS) {
			this.errors.push(createTokenError(ERROR.UnexpectedToken, first, LexerTOKEN_TYPES.LEFT_PARENTHESIS))
			return
		}
		const last = arg.pop() ?? null
		if (last === null) {
			this.errors.push(createMissingError(first.end, LexerTOKEN_TYPES.RIGHT_PARENTHESIS))
			return
		}
		if (last.type !== LexerTOKEN_TYPES.RIGHT_PARENTHESIS) {
			this.errors.push(createTokenError(ERROR.UnexpectedToken, last, LexerTOKEN_TYPES.RIGHT_PARENTHESIS))
			return
		}
		let next: [FunctionArgument, LexerToken[]] | null = null
		while ((next = FunctionArgument.parse(arg, this)) !== null) {
			this.arguments.push(next[0])
			arg = next[1]
			if (arg.length === 0) break

			if (arg[0]?.type in lexerSeparatorTokens) arg.shift()
			else {
				this.errors.push(createTokenError(ERROR.UnexpectedToken, arg[0], LexerTOKEN_TYPES.COMMA))
				break
			}
		}
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
	static is(token: TokenInterface | null): token is FunctionStatement {
		if (token === null) return false
		return token.type === TOKEN_TYPES.FunctionStatement
	}
	static parse(tokens: LexerToken[], parent: TokenInterface): [TokenInterface, LexerToken[]] | null {
		if (tokens.length === 0) return null
		const first = tokens[0]
		if (first.type !== LexerTOKEN_TYPES.FUNCTION) return null
		tokens.shift()
		const Identifier = tokens.shift()
		if (Identifier?.type !== LexerTOKEN_TYPES.IDENTIFIER) {
			if (Identifier)
				parent.errors.push(createTokenError(ERROR.UnexpectedToken, Identifier, LexerTOKEN_TYPES.IDENTIFIER))
			return null
		}
		const b = tokens.shift()
		if (b?.type !== LexerTOKEN_TYPES.LEFT_PARENTHESIS) {
			if (b) parent.errors.push(createTokenError(ERROR.UnexpectedToken, b, LexerTOKEN_TYPES.LEFT_PARENTHESIS))
			return null
		}
		// find next Right Parenthesis
		let next = tokens.findIndex((x) => x.type === LexerTOKEN_TYPES.RIGHT_PARENTHESIS)
		if (next === undefined) {
			parent.errors.push(createMissingError(tokens[tokens.length - 1].end, LexerTOKEN_TYPES.RIGHT_PARENTHESIS))
			return null
		}


		return [newToken, tokens]
	}
}

export default FunctionStatement
