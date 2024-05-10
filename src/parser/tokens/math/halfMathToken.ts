import { ERROR, type ErrorListing } from "../../errors"
import { type mathTree } from "../../evaluateMath"
import { getNextTokenFromMathTree } from "."
import { HalfMathTokenTOKEN_TYPES, type LexerToken, type TokenInterface } from "../../tokens"

export class HalfMathToken implements TokenInterface {
	readonly type: HalfMathTokenTOKEN_TYPES
	readonly start: number
	readonly end: number
	readonly length: number
	readonly parent: TokenInterface | null
	readonly errors: ErrorListing[]
	readonly isCodeBlock: false = false
	readonly variables: undefined
	readonly constants: undefined
	readonly right: TokenInterface
	constructor(right: mathTree, operator: HalfMathTokenTOKEN_TYPES, parent: TokenInterface, token: LexerToken) {
		const r = getNextTokenFromMathTree(right, parent)
		if (r === null) throw ERROR.InvalidToken
		this.right = r
		this.start = token.start
		this.end = this.right.end
		this.length = this.end - this.start
		this.parent = parent
		this.errors = parent.errors
		this.type = operator
	}
	static is(token: TokenInterface | null): token is HalfMathToken {
		if (token === null) return false
		return token.type in HalfMathTokenTOKEN_TYPES
	}
}


export default HalfMathToken
