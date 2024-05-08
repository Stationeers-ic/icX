import { ERROR, ErrorListing } from "../errors"
import { getNextTokenFromMathTree, mathTree } from "../evaluateMath"
import { LexerToken, TokenInterface } from "../tokens"

export class HalfMathToken {
	readonly start: number
	readonly end: number
	readonly length: number
	readonly parent: TokenInterface | null
	readonly errors: ErrorListing[]
	readonly isCodeBlock: false = false
	readonly variables: undefined
	readonly constants: undefined
	readonly right: TokenInterface
	constructor(right: mathTree, parent: TokenInterface, token: LexerToken) {
		const r = getNextTokenFromMathTree(right, parent)
		if (r === null) throw ERROR.InvalidToken
		this.right = r
		this.start = token.start
		this.end = this.right.end
		this.length = this.end - this.start
		this.parent = parent
		this.errors = parent.errors
	}
}
