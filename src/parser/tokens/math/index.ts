import { createTokenError, ERROR } from "../../errors"
import { type mathTree } from "../../evaluateMath"
import { getNextToken } from "../../getNextToken"
import { type TokenInterface, LexerToken, LexerTOKEN_TYPES } from "../../tokens"
import HalfMathToken from './HalfMathToken';
import MathToken from "./MathTokens"

const half = {

} as const satisfies Record<LexerToken, HalfMathToken>

export function getNextTokenFromMathTree(tree: mathTree, parent: TokenInterface): TokenInterface | null {
	if ("value" in tree) {
		const r = getNextToken([tree.value], parent)
		if (r === null) {
			parent.errors.push(createTokenError(ERROR.UnexpectedToken, tree.value))
			return null
		}
		const [token, lexer] = r
		lexer.forEach((x) => parent.errors.push(createTokenError(ERROR.UnexpectedToken, x)))
		if (token === null) {
			parent.errors.push(createTokenError(ERROR.UnexpectedToken, tree.value))
			return null
		}
		return token
	}
	if (tree.left === undefined) {
	return new HalfMathToken(tree.right, tree.operator, parent, tree.token)
	}
	return new MathToken(tree.left, tree.right, tree.operator, parent)

	return null
}
