import { createTokenError, ERROR } from "../../errors"
import { type mathTree } from "../../evaluateMath"
import { getNextToken } from "../../getNextToken"
import { type TokenInterface, LexerTOKEN_TYPES } from "../../tokens"
import Addition from "./Addition"
import LogicalNot from "./LogicalNot"
import Multiplication from "./Multiplication"
import Subtraction from "./Subtraction"


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
		switch (tree.operator) {
			case LexerTOKEN_TYPES.LOGICAL_NOT:
				return new LogicalNot(tree.right, parent, tree.token)
		}
		return null
	}
	switch (tree.operator) {
		case LexerTOKEN_TYPES.ADDITION:
			return new Addition(tree.left, tree.right, parent)
		case LexerTOKEN_TYPES.MULTIPLICATION:
			return new Multiplication(tree.left, tree.right, parent)
		case LexerTOKEN_TYPES.SUBTRACTION:
			return new Subtraction(tree.left, tree.right, parent)
	}

	return null
}
