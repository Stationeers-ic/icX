import { type Token as LexerToken, TOKEN_TYPES as LexerTOKEN_TYPES } from "../lexer"
import { createTokenError, ERROR } from "./errors"
import { lexerCalculationTokens, TokenInterface } from "./tokens"
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
function isCalculationOperator(token: string): token is keyof typeof CalculationOperators {
	return token in CalculationOperators
}
// export const CalculationOperators: {
// 	[T exports LexerTOKEN_TYPES]: {
// 	type: LexerTOKEN_TYPES,
// 	precedence: number,
// 	associativity: "left" | "right",
// }} = {
// 	LEFT_PARENTHESIS: LexerTOKEN_TYPES.LEFT_PARENTHESIS,
// 	RIGHT_PARENTHESIS: LexerTOKEN_TYPES.RIGHT_PARENTHESIS,
// 	EXPONENTIATION: LexerTOKEN_TYPES.EXPONENTIATION,
// 	MULTIPLICATION: LexerTOKEN_TYPES.MULTIPLICATION,
// 	DIVISION: LexerTOKEN_TYPES.DIVISION,
// 	REMAINDER: LexerTOKEN_TYPES.REMAINDER,
// 	ADDITION: LexerTOKEN_TYPES.ADDITION,
// 	SUBTRACTION: LexerTOKEN_TYPES.SUBTRACTION,
// 	LESS_THAN: LexerTOKEN_TYPES.LESS_THAN,
// 	GREATER_THAN: LexerTOKEN_TYPES.GREATER_THAN,
// 	EQUAL: LexerTOKEN_TYPES.EQUAL,
// 	NOT_EQUAL: LexerTOKEN_TYPES.NOT_EQUAL,
// 	LESS_THAN_EQUAL: LexerTOKEN_TYPES.LESS_THAN_EQUAL,
// 	GREATER_THAN_EQUAL: LexerTOKEN_TYPES.GREATER_THAN_EQUAL,
// 	LOGICAL_AND: LexerTOKEN_TYPES.LOGICAL_AND,
// 	LOGICAL_OR: LexerTOKEN_TYPES.LOGICAL_OR,
// 	LOGICAL_NOT: LexerTOKEN_TYPES.LOGICAL_NOT,
// 	BITWISE_AND: LexerTOKEN_TYPES.BITWISE_AND,
// 	BITWISE_OR: LexerTOKEN_TYPES.BITWISE_OR,
// 	BITWISE_XOR: LexerTOKEN_TYPES.BITWISE_XOR,
// 	BITWISE_NOT: LexerTOKEN_TYPES.BITWISE_NOT,
// 	BITWISE_LEFT_SHIFT: LexerTOKEN_TYPES.BITWISE_LEFT_SHIFT,
// 	BITWISE_RIGHT_SHIFT_ARITHMETIC: LexerTOKEN_TYPES.BITWISE_RIGHT_SHIFT_ARITHMETIC,
// 	BITWISE_RIGHT_SHIFT_LOGICAL: LexerTOKEN_TYPES.BITWISE_RIGHT_SHIFT_LOGICAL,
// 	TRUE: LexerTOKEN_TYPES.TRUE,
// 	FALSE: LexerTOKEN_TYPES.FALSE,
// } as const
export function evaluateMath(
	tokens: LexerToken[],
	parent: TokenInterface,
): [TokenInterface | null, LexerToken[]] | null {
	const lastIndex = tokens.findIndex((x) => !(x.type in lexerCalculationTokens))
	if (lastIndex <= 1) return null
	const included = tokens.slice(0, lastIndex)
	const other = tokens.slice(lastIndex)
	const values: LexerToken[] = []
	const operators: [LexerToken, CalculationOperator][] = []

	while (included.length !== 0) {
		const token = included.shift()
		if (!token) break
		const type = token.type
		if (!(type in lexerCalculationTokens)) throw new Error("Invalid token")
		const topStack = operators[operators.length - 1]
		if (isCalculationOperator(type)) {
			if (topStack === undefined) {
				operators.push([token, CalculationOperators[type]])
				continue
			}
			if (type === "RIGHT_PARENTHESIS") {
				let last:[LexerToken, CalculationOperator] | undefined
				while ((last = operators.pop()) !== undefined) {
					console.log(last);
					if (last[0].type === "LEFT_PARENTHESIS") break
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
			values.push(token.value)
		}
	}
	while (operators.length !== 0) {
		values.push(operators.pop()![0])
	}
	console.log("V", values, operators);

	return [null, other]
}
