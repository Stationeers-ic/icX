import { createError, createMissingError, createTokenError, ERROR } from "./errors"
import { getNextToken } from "./getNextToken"
import { getDefault } from "./helpers"
import { LexerToken, LexerTOKEN_TYPES, lexerCalculationTokens, TokenInterface } from "./tokens"
import Addition from "./tokens/Addition"
import FunctionCall from "./tokens/FunctionCall"
import LogicalNot from "./tokens/LogicalNot"
import Multiplication from "./tokens/Multiplication"

export type mathTree =
	| { left?: mathTree; right: mathTree; operator: LexerTOKEN_TYPES; token: LexerToken }
	| { value: LexerToken }

const temp = {
	LEFT_PARENTHESIS: {
		type: LexerTOKEN_TYPES.LEFT_PARENTHESIS,
		precedence: 0,
		associativity: null,
	},
	RIGHT_PARENTHESIS: {
		type: LexerTOKEN_TYPES.RIGHT_PARENTHESIS,
		precedence: 18,
		associativity: null,
	},
	DOT: {
		type: LexerTOKEN_TYPES.DOT,
		precedence: 17,
		associativity: "left",
	},
	UNARY_ADDITION: {
		type: LexerTOKEN_TYPES.UNARY_ADDITION,
		precedence: 14,
		associativity: null,
	},
	UNARY_NEGATION: {
		type: LexerTOKEN_TYPES.UNARY_NEGATION,
		precedence: 14,
		associativity: null,
	},
	LOGICAL_NOT: {
		type: LexerTOKEN_TYPES.LOGICAL_NOT,
		precedence: 14,
		associativity: null,
	},
	BITWISE_NOT: {
		type: LexerTOKEN_TYPES.BITWISE_NOT,
		precedence: 14,
		associativity: null,
	},
	EXPONENTIATION: {
		type: LexerTOKEN_TYPES.EXPONENTIATION,
		precedence: 13,
		associativity: "right",
	},
	MULTIPLICATION: {
		type: LexerTOKEN_TYPES.MULTIPLICATION,
		precedence: 12,
		associativity: "left",
	},
	DIVISION: {
		type: LexerTOKEN_TYPES.DIVISION,
		precedence: 12,
		associativity: "left",
	},
	REMAINDER: {
		type: LexerTOKEN_TYPES.REMAINDER,
		precedence: 12,
		associativity: "left",
	},
	ADDITION: {
		type: LexerTOKEN_TYPES.ADDITION,
		precedence: 11,
		associativity: "left",
	},
	SUBTRACTION: {
		type: LexerTOKEN_TYPES.SUBTRACTION,
		precedence: 11,
		associativity: "left",
	},
	BITWISE_LEFT_SHIFT: {
		type: LexerTOKEN_TYPES.BITWISE_LEFT_SHIFT,
		precedence: 10,
		associativity: "left",
	},
	BITWISE_RIGHT_SHIFT_ARITHMETIC: {
		type: LexerTOKEN_TYPES.BITWISE_RIGHT_SHIFT_ARITHMETIC,
		precedence: 10,
		associativity: "left",
	},
	BITWISE_RIGHT_SHIFT_LOGICAL: {
		type: LexerTOKEN_TYPES.BITWISE_RIGHT_SHIFT_LOGICAL,
		precedence: 10,
		associativity: "left",
	},
	LESS_THAN: {
		type: LexerTOKEN_TYPES.LESS_THAN,
		precedence: 9,
		associativity: "left",
	},
	GREATER_THAN: {
		type: LexerTOKEN_TYPES.GREATER_THAN,
		precedence: 9,
		associativity: "left",
	},
	LESS_THAN_EQUAL: {
		type: LexerTOKEN_TYPES.LESS_THAN_EQUAL,
		precedence: 9,
		associativity: "left",
	},
	GREATER_THAN_EQUAL: {
		type: LexerTOKEN_TYPES.GREATER_THAN_EQUAL,
		precedence: 9,
		associativity: "left",
	},
	EQUAL: {
		type: LexerTOKEN_TYPES.EQUAL,
		precedence: 8,
		associativity: "left",
	},
	NOT_EQUAL: {
		type: LexerTOKEN_TYPES.NOT_EQUAL,
		precedence: 8,
		associativity: "left",
	},
	BITWISE_AND: {
		type: LexerTOKEN_TYPES.BITWISE_AND,
		precedence: 7,
		associativity: "left",
	},
	BITWISE_OR: {
		type: LexerTOKEN_TYPES.BITWISE_OR,
		precedence: 6,
		associativity: "left",
	},
	BITWISE_XOR: {
		type: LexerTOKEN_TYPES.BITWISE_XOR,
		precedence: 5,
		associativity: "left",
	},
	LOGICAL_AND: {
		type: LexerTOKEN_TYPES.LOGICAL_AND,
		precedence: 4,
		associativity: "left",
	},
	LOGICAL_OR: {
		type: LexerTOKEN_TYPES.LOGICAL_OR,
		precedence: 3,
		associativity: "left",
	},
} as const
type CalculationOperator<T extends keyof typeof temp = any> = {
	type: T
	precedence: number
	associativity: "left" | "right" | null
}
export const CalculationOperators: {
	[key in keyof typeof temp]: CalculationOperator<key>
} = temp
function isCalculationOperator(token?: string | null): token is keyof typeof CalculationOperators {
	if (!token) return false
	return token in CalculationOperators
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
	}

	return null
}

export function evaluateMath(
	tokens: LexerToken[],
	parent: TokenInterface,
): [TokenInterface | null, LexerToken[]] | null {
	const lastIndex = getDefault(tokens.findIndex((x) => !(x.type in lexerCalculationTokens)), tokens.length)
	if (lastIndex <= 1) return null
	const included = tokens.slice(0, lastIndex)
	const mathStart = included[0]?.start ?? -1
	const mathEnd = included[included.length - 1]?.end ?? -1
	const other = tokens.slice(lastIndex)
	const values: LexerToken[] = []
	const operators: [LexerToken, CalculationOperator][] = []
	let last: LexerToken | null = null
	let token: LexerToken | undefined | null = null
	while (token !== undefined) {
		last = token
		token = included.shift()
		if (!token) break
		let type = token.type
		if (!(type in lexerCalculationTokens)) throw new Error("Invalid token")
		const topStack = operators[operators.length - 1]
		if (isCalculationOperator(type)) {
			const lastType = last?.type
			if (
				lastType === undefined ||
				(isCalculationOperator(lastType) && lastType !== LexerTOKEN_TYPES.RIGHT_PARENTHESIS)
			) {
				if (type === LexerTOKEN_TYPES.ADDITION) {
					token = {
						...token,
						type: LexerTOKEN_TYPES.UNARY_ADDITION,
					}
					type = LexerTOKEN_TYPES.UNARY_ADDITION
				} else if (type === LexerTOKEN_TYPES.SUBTRACTION) {
					token = {
						...token,
						type: LexerTOKEN_TYPES.UNARY_NEGATION,
					}
					type = LexerTOKEN_TYPES.UNARY_NEGATION
				}
			}
			if (topStack === undefined) {
				operators.push([token, CalculationOperators[type]])
				continue
			}
			if (type === LexerTOKEN_TYPES.RIGHT_PARENTHESIS) {
				let last: [LexerToken, CalculationOperator] | undefined
				while ((last = operators.pop()) !== undefined) {
					if (last[0].type === LexerTOKEN_TYPES.LEFT_PARENTHESIS) break
					values.push(last[0])
				}
				continue
			}
			if (CalculationOperators[type].precedence > topStack[1].precedence) {
				operators.push([token, CalculationOperators[type]])
				continue
			}
			operators.pop()
			values.push(topStack[0])
			operators.push([token, CalculationOperators[type]])
		} else {
			if (type === LexerTOKEN_TYPES.COMMA) {
				parent.errors.push(createTokenError(ERROR.UnexpectedToken, token))
				continue
			}
			if (type === LexerTOKEN_TYPES.IDENTIFIER && included[0]?.type === LexerTOKEN_TYPES.LEFT_PARENTHESIS) {
				// find next matching right parenthesis
				const fnTokens: LexerToken[] = [token]
				let depth = 0
				while (included.length !== 0) {
					const next = included.shift()
					if (!next) break
					fnTokens.push(next)
					if (next.type === LexerTOKEN_TYPES.LEFT_PARENTHESIS) {
						depth++
					}
					if (next.type === LexerTOKEN_TYPES.RIGHT_PARENTHESIS) {
						depth--
						if (depth <= 0) {
							break
						}
					}
				}
				if (depth > 0)
					parent.errors.push(
						createMissingError(
							fnTokens[fnTokens.length - 1]?.end ?? token.end,
							LexerTOKEN_TYPES.RIGHT_PARENTHESIS,
						),
					)
				const start = fnTokens[0]?.start ?? -1
				const end = fnTokens[fnTokens.length - 1]?.end ?? -1
				values.push({
					type: LexerTOKEN_TYPES.FUNCTION_CALL,
					start,
					end,
					length: end - start,
					value: fnTokens,
				})
				continue
			}
			values.push(token)
		}
	}
	while (operators.length !== 0) {
		values.push(operators.pop()![0])
	}
	const variables: mathTree[] = []
	let value: LexerToken | undefined
	while ((value = values.shift()) !== undefined) {
		const type = value.type
		if (isCalculationOperator(type)) {
			const right = variables.pop()
			if (right === undefined) {
				parent.errors.push(createError(ERROR.CannotFormMath, mathStart, mathEnd))
				return [null, other]
			}
			if (CalculationOperators[type].associativity === null)
				variables.push({ right, operator: type, token: value })
			else {
				const left = variables.pop()
				if (left === undefined) {
					parent.errors.push(createError(ERROR.CannotFormMath, mathStart, mathEnd))
					return [null, other]
				}
				variables.push({ left, right, operator: type, token: value })
			}
		} else {
			variables.push({ value })
		}
	}
	// console.log(variables[0])
	if (variables.length > 1) {
		parent.errors.push(createError(ERROR.CannotFormMath, mathStart, mathEnd))
		return [null, other]
	}
	if (variables[0] !== undefined) return [getNextTokenFromMathTree(variables[0], parent), other]
	return [null, other]
}
