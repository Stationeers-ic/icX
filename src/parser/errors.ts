import { type Token as LexerToken, TOKEN_TYPES as LexerTOKEN_TYPES } from "../lexer"
const temp = {
	EOFNotFound: {
		name: "EOFNotFound",
		message: "cannot form Program: EOF not found",
	},
	InvalidToken: {
		name: "InvalidToken",
		message: "cannot form Program: invalid token",
	},
	UnexpectedToken: {
		name: "UnexpectedToken",
		message: "cannot form Program: unexpected token",
	},
	NoToken: {
		name: "NoToken",
		message: "cannot form Program: no token",
	},
} as const

export const ERROR: {
	[key in keyof typeof temp]: {
		name: string
		message: string
	}
} = temp

export type ErrorListing = {
	error: (typeof ERROR)[keyof typeof ERROR]
	start: number
	end: number
	expected?: LexerTOKEN_TYPES
	token?: LexerToken
	other?: Record<string, any>
}

export function createTokenError(
	error: (typeof ERROR)[keyof typeof ERROR],
	token: LexerToken,
	expected?: LexerTOKEN_TYPES,
): ErrorListing {
	return { error, start: token.start, end: token.end, token, expected }
}
export function createError(error: (typeof ERROR)[keyof typeof ERROR], start: number, end: number): ErrorListing {
	return { error, start, end }
}
