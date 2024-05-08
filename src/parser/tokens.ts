import { type Token as LexerToken, TOKEN_TYPES as LexerTOKEN_TYPES  } from "../lexer"
import { ErrorListing } from "./errors"
// export interface TokenInterface = BToken


export interface TokenInterface {
	type: TOKEN_TYPES
	start: number
	end: number
	length: number
	parent: TokenInterface | null
	errors: ErrorListing[]
	isCodeBlock: boolean
	variables?: {}
	constants?: {}
}
export abstract class Token {
	static parse(tokens: LexerToken[], parent: TokenInterface): [TokenInterface, LexerToken[]] | null {
		throw new Error("Method not implemented! Use derived class")
	}
}

export const TOKEN_TYPES = {
	Program: "Program",
	VariableDeclaration: "VariableDeclaration",
	VariableDeclarator: "VariableDeclarator",
	VariableAssignment: "VariableAssignment",
	AssignmentBlock: "AssignmentBlock",
	Identifier: "Identifier",
	StringToken: "StringToken",
	NumberToken: "NumberToken",
} as const
export type TOKEN_TYPES = (typeof TOKEN_TYPES)[keyof typeof TOKEN_TYPES]
export default TOKEN_TYPES


export const lexerBrakeTokens = {
	NEWLINE: LexerTOKEN_TYPES.NEWLINE,
	SEMICOLON: LexerTOKEN_TYPES.SEMICOLON,
	EOF: LexerTOKEN_TYPES.EOF,
} as const
export const lexerSeparatorTokens = {
	COMMA: LexerTOKEN_TYPES.COMMA,
} as const

export const lexerCalculationTokens = {
	LEFT_PARENTHESIS: LexerTOKEN_TYPES.LEFT_PARENTHESIS,
	RIGHT_PARENTHESIS: LexerTOKEN_TYPES.RIGHT_PARENTHESIS,
	EXPONENTIATION: LexerTOKEN_TYPES.EXPONENTIATION,
	MULTIPLICATION: LexerTOKEN_TYPES.MULTIPLICATION,
	DOT: LexerTOKEN_TYPES.DOT,
	DIVISION: LexerTOKEN_TYPES.DIVISION,
	REMAINDER: LexerTOKEN_TYPES.REMAINDER,
	ADDITION: LexerTOKEN_TYPES.ADDITION,
	SUBTRACTION: LexerTOKEN_TYPES.SUBTRACTION,
	LESS_THAN: LexerTOKEN_TYPES.LESS_THAN,
	GREATER_THAN: LexerTOKEN_TYPES.GREATER_THAN,
	EQUAL: LexerTOKEN_TYPES.EQUAL,
	NOT_EQUAL: LexerTOKEN_TYPES.NOT_EQUAL,
	LESS_THAN_EQUAL: LexerTOKEN_TYPES.LESS_THAN_EQUAL,
	GREATER_THAN_EQUAL: LexerTOKEN_TYPES.GREATER_THAN_EQUAL,
	LOGICAL_AND: LexerTOKEN_TYPES.LOGICAL_AND,
	LOGICAL_OR: LexerTOKEN_TYPES.LOGICAL_OR,
	LOGICAL_NOT: LexerTOKEN_TYPES.LOGICAL_NOT,
	BITWISE_AND: LexerTOKEN_TYPES.BITWISE_AND,
	BITWISE_OR: LexerTOKEN_TYPES.BITWISE_OR,
	BITWISE_XOR: LexerTOKEN_TYPES.BITWISE_XOR,
	BITWISE_NOT: LexerTOKEN_TYPES.BITWISE_NOT,
	BITWISE_LEFT_SHIFT: LexerTOKEN_TYPES.BITWISE_LEFT_SHIFT,
	BITWISE_RIGHT_SHIFT_ARITHMETIC: LexerTOKEN_TYPES.BITWISE_RIGHT_SHIFT_ARITHMETIC,
	BITWISE_RIGHT_SHIFT_LOGICAL: LexerTOKEN_TYPES.BITWISE_RIGHT_SHIFT_LOGICAL,
	TRUE: LexerTOKEN_TYPES.TRUE,
	FALSE: LexerTOKEN_TYPES.FALSE,
	NUMBER: LexerTOKEN_TYPES.NUMBER,
	IDENTIFIER: LexerTOKEN_TYPES.IDENTIFIER,
} as const
export type lexerCalculationTokens = (typeof lexerCalculationTokens)[keyof typeof lexerCalculationTokens]
