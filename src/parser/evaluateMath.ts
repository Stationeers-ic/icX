import { createError, createMissingError, createTokenError, ERROR } from "./errors"
import { getDefault } from "./helpers"
import { LexerToken, LexerTOKEN_TYPES, lexerCalculationTokens, TokenInterface } from "./tokens"
import FunctionCall from "./tokens/FunctionCall"
import { getNextTokenFromMathTree } from "./tokens/math"

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

export function shuntingYarn(included: LexerToken[], parent: TokenInterface) {
	const output: LexerToken[] = []
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
			// convert + and - to unary + and - if they are after calculationToken
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
			// if operators stack is empty add
			if (topStack === undefined) {
				operators.push([token, CalculationOperators[type]])
				continue
			}
			// if this is closing parenthesis pop all operators to values until left parenthesis is found
			if (type === LexerTOKEN_TYPES.RIGHT_PARENTHESIS) {
				let last: [LexerToken, CalculationOperator] | undefined
				while ((last = operators.pop()) !== undefined) {
					if (last[0].type === LexerTOKEN_TYPES.LEFT_PARENTHESIS) break
					output.push(last[0])
				}
				continue
			}
			// add to value stack if this is higher precedence than top of operator stack
			if (CalculationOperators[type].precedence > topStack[1].precedence) {
				operators.push([token, CalculationOperators[type]])
				continue
			}

			let i = operators[operators.length - 1]
			// while precedence is same or lower
			// pop operators to values until top of operator stack is higher precedence
			// while ((i = operators[operators.length - 1]) !== undefined) {
			// 	if (i[1].precedence >= CalculationOperators[type].precedence) break
			// 	if (i[0].type === LexerTOKEN_TYPES.LEFT_PARENTHESIS) break
			// 	output.push(operators.pop()![0])
			// }
			operators.pop()
			output.push(topStack[0])
			// add operator to stack
			operators.push([token, CalculationOperators[type]])
		} else {
			// if comma ignore and add error
			if (type === LexerTOKEN_TYPES.COMMA) {
				parent.errors.push(createTokenError(ERROR.UnexpectedToken, token))
				continue
			}
			// if function call create FUNCTION_CALL token
			if (type === LexerTOKEN_TYPES.IDENTIFIER && included[0]?.type === LexerTOKEN_TYPES.LEFT_PARENTHESIS) {
				const fnTokens: LexerToken[] = [token]
				let depth = 0
				// find next matching right parenthesis
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
				// if missing closing parenthesis add error
				if (depth > 0)
					parent.errors.push(
						createMissingError(
							fnTokens[fnTokens.length - 1]?.end ?? token.end,
							LexerTOKEN_TYPES.RIGHT_PARENTHESIS,
						),
					)
				const start = fnTokens[0]?.start ?? -1
				const end = fnTokens[fnTokens.length - 1]?.end ?? -1
				// add function call token to output
				output.push({
					type: LexerTOKEN_TYPES.FUNCTION_CALL,
					start,
					end,
					length: end - start,
					value: fnTokens,
				})
				continue
			}
			output.push(token)
		}
	}
	// add remaining operators to output
	while (operators.length !== 0) {
		output.push(operators.pop()![0])
	}
	return output
}

export function createMathTree(values: LexerToken[], parent: TokenInterface, mathStart:number, mathEnd:number) {
const variables: mathTree[] = []
	let value: LexerToken | undefined
	while ((value = values.shift()) !== undefined) {
		const type = value.type
		if (isCalculationOperator(type)) {
			const right = variables.pop()
			if (right === undefined) {
				parent.errors.push(createError(ERROR.CannotFormMath, mathStart, mathEnd))
				return null
			}
			if (CalculationOperators[type].associativity === null)
				variables.push({ right, operator: type, token: value })
			else {
				const left = variables.pop()
				if (left === undefined) {
					parent.errors.push(createError(ERROR.CannotFormMath, mathStart, mathEnd))
					return null
				}
				variables.push({ left, right, operator: type, token: value })
			}
		} else {
			variables.push({ value })
		}
	}
	if (variables.length > 1) {
		parent.errors.push(createError(ERROR.CannotFormMath, mathStart, mathEnd))
		return null
	}
	return variables[0]
}
export function evaluateMath(
	tokens: LexerToken[],
	parent: TokenInterface,
): [TokenInterface | null, LexerToken[]] | null {
	const lastIndex = getDefault(
		tokens.findIndex((x) => !(x.type in lexerCalculationTokens)),
		tokens.length,
	)
	// if singular calculationToken: not math problem
	if (lastIndex <= 1) return null
	const included = tokens.slice(0, lastIndex)
	const mathStart = included[0]?.start ?? -1
	const mathEnd = included[included.length - 1]?.end ?? -1
	const other = tokens.slice(lastIndex)
	// use shunting yard to convert to reverse polish notation
	const values = shuntingYarn(included, parent)
	// create tree
	const tree = createMathTree(values, parent, mathStart, mathEnd)
	if (tree === null) return [null, other]
	return [getNextTokenFromMathTree(tree, parent), other]
}
