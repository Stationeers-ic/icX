import type { CODE_TOKEN } from "@/lexer"

export type ErrorMessage = {
	type: ErrorType
	start: number
	end: number
	tokens: CODE_TOKEN[]
}
export const AST_NODE_TYPE = {
	FUNCTION: "FUNCTION",
	WHILE: "WHILE",
	IF: "IF",
	BLOCK: "BLOCK",
	BREAK: "BREAK",
	CONTINUE: "CONTINUE",
	RETURN: "RETURN",
	MATH: "MATH",
	STRING: "STRING",
	ARGUMENT: "ARGUMENT",
	LABEL: "LABEL",
	COMMENT: "COMMENT",
	INSTRUCTION: "INSTRUCTION",
} as const
export type AST_NODE_TYPE = (typeof AST_NODE_TYPE)[keyof typeof AST_NODE_TYPE]

export const ErrorType = {
	UNEXPECTED: "UNEXPECTED",
	NO_CLOSING: "NO_CLOSING",
}
export type ErrorType = (typeof ErrorType)[keyof typeof ErrorType]
