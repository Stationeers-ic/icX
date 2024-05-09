import TOKEN_TYPES, { type TokenInterface } from "../../tokens"
import { type mathTree } from "../../evaluateMath"
import { MathToken } from "./mathTokens"

export class Multiplication extends MathToken implements TokenInterface {
	readonly type = TOKEN_TYPES.Multiplication
	constructor(left: mathTree, right: mathTree, parent: TokenInterface) {
		super(left, right, parent)
	}
	static is(token: TokenInterface | null): token is Multiplication {
		if (token === null) return false
		return token.type === TOKEN_TYPES.Multiplication
	}
}

export default Multiplication
