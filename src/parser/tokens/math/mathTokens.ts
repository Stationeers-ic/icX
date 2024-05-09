import { ERROR, ErrorListing } from "../../errors"
import { type mathTree } from "../../evaluateMath"
import { getNextTokenFromMathTree } from "."
import { TokenInterface } from "../../tokens"

export class MathToken {
	readonly start: number
	readonly end: number
	readonly length: number
	readonly parent: TokenInterface | null
	readonly errors: ErrorListing[]
	readonly isCodeBlock: false = false
	readonly variables: undefined
	readonly constants: undefined
	readonly left: TokenInterface
	readonly right: TokenInterface
	constructor(left: mathTree, right: mathTree, parent: TokenInterface) {
		const l = getNextTokenFromMathTree(left, parent)
		const r = getNextTokenFromMathTree(right, parent)
		if (l === null || r === null) throw ERROR.InvalidToken
		this.left = l
		this.right = r
		this.start = this.left.start
		this.end = this.right.end
		this.length = this.end - this.start
		this.parent = parent
		this.errors = parent.errors
	}
}
