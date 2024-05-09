import TOKEN_TYPES, { type LexerToken, type TokenInterface } from "../../tokens"
import { type mathTree } from "../../evaluateMath"
import { HalfMathToken } from "./halfMathToken"

export class LogicalNot extends HalfMathToken implements TokenInterface {
	readonly type = TOKEN_TYPES.LogicalNot
	constructor(right: mathTree, parent: TokenInterface, token: LexerToken) {
		super(right, parent, token)
	}
	static is(token: TokenInterface | null): token is LogicalNot {
		if (token === null) return false
		return token.type === TOKEN_TYPES.LogicalNot
	}
}

export default LogicalNot
