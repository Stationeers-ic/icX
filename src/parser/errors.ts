import { LexerToken, LexerTOKEN_TYPES } from "./tokens"
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
	MissingToken: {
		name: "MissingToken",
		message: "cannot form Program: Missing Token",
	},
} as const

export const ERROR: {
	[key in keyof typeof temp]: {
		name: key
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
	if (expected) return { error, start: token.start, end: token.end, token, expected }
	return { error, start: token.start, end: token.end, token }
}
export function createMissingError(position: number, expected: LexerTOKEN_TYPES): ErrorListing {
	return { error: ERROR.MissingToken, start: position, end: position, expected }
}
export function createError(error: (typeof ERROR)[keyof typeof ERROR], start: number, end: number): ErrorListing {
	return { error, start, end }
}
