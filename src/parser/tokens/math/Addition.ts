import TOKEN_TYPES, { Token, TokenInterface } from "../../tokens"
import { type mathTree } from "../../evaluateMath"
import { getNextTokenFromMathTree } from "."
import { MathToken } from "./mathTokens"

export class Addition extends MathToken implements TokenInterface {
	readonly type = TOKEN_TYPES.Addition
	constructor(left: mathTree, right: mathTree, parent: TokenInterface) {
		super(left, right, parent)
	}
	static is(token: TokenInterface | null): token is Addition {
		if (token === null) return false
		return token.type === TOKEN_TYPES.Addition
	}
}

export default Addition
