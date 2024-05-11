import { createTokenError, ERROR } from "../../errors"
import { type mathTree } from "../../evaluateMath"
import { getNextToken } from "../../getNextToken"
import { type TokenInterface, HalfMathTokenTOKEN_TYPES, LexerToken, LexerTOKEN_TYPES, MathOperatorTOKEN_TYPES } from "../../tokens"
import HalfMathToken from './HalfMathToken';
import MathToken from "./MathTokens"

const half = {
	UNARY_ADDITION: HalfMathTokenTOKEN_TYPES.UnaryPlus,
	UNARY_NEGATION: HalfMathTokenTOKEN_TYPES.UnaryMinus,
	BITWISE_NOT: HalfMathTokenTOKEN_TYPES.BitwiseNot,
	LOGICAL_NOT: HalfMathTokenTOKEN_TYPES.LogicalNot,
} as const satisfies Partial<Record<LexerTOKEN_TYPES, HalfMathTokenTOKEN_TYPES>>
const full = {
	EXPONENTIATION: MathOperatorTOKEN_TYPES.Exponentiation,
	MULTIPLICATION: MathOperatorTOKEN_TYPES.Multiplication,
	DOT: MathOperatorTOKEN_TYPES.Dot,
	DIVISION: MathOperatorTOKEN_TYPES.Division,
	REMAINDER: MathOperatorTOKEN_TYPES.Remainder,
	ADDITION: MathOperatorTOKEN_TYPES.Addition,
	SUBTRACTION: MathOperatorTOKEN_TYPES.Subtraction,
	LESS_THAN: MathOperatorTOKEN_TYPES.LessThan,
	GREATER_THAN: MathOperatorTOKEN_TYPES.GreaterThan,
	EQUAL: MathOperatorTOKEN_TYPES.Equal,
	NOT_EQUAL: MathOperatorTOKEN_TYPES.NotEqual,
	LESS_THAN_EQUAL: MathOperatorTOKEN_TYPES.LessThanEqual,
	GREATER_THAN_EQUAL: MathOperatorTOKEN_TYPES.GreaterThanEqual,
	LOGICAL_AND: MathOperatorTOKEN_TYPES.LogicalAnd,
	LOGICAL_OR: MathOperatorTOKEN_TYPES.LogicalOr,
	BITWISE_AND: MathOperatorTOKEN_TYPES.BitwiseAnd,
	BITWISE_OR: MathOperatorTOKEN_TYPES.BitwiseOr,
	BITWISE_XOR: MathOperatorTOKEN_TYPES.BitwiseXor,
	BITWISE_LEFT_SHIFT: MathOperatorTOKEN_TYPES.LeftShift,
	BITWISE_RIGHT_SHIFT_ARITHMETIC: MathOperatorTOKEN_TYPES.RightShiftArithmetic,
	BITWISE_RIGHT_SHIFT_LOGICAL: MathOperatorTOKEN_TYPES.RightShiftLogical,
} as const satisfies Partial<Record<LexerTOKEN_TYPES, MathOperatorTOKEN_TYPES>>

function isIn<T extends Record<string, any>>(x: any, obj: T): x is keyof T {
	return x in obj
}
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
	const op= tree.operator
	if (tree.left === undefined) {
		if (isIn(op, half))
			return new HalfMathToken(tree.right, half[op], parent, tree.token)
		return null

	}
	if (isIn(op, full))
		return new MathToken(tree.left, tree.right, full[op], parent)
	return null
}
