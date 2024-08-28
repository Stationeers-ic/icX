import { ERROR } from "./errors"
import { LexerToken, LexerTOKEN_TYPES } from "./tokens"
import Program from "./tokens/Program"


export function parseProgram(tokens: LexerToken[]): Program {
	// find EOF token
	const index = tokens.findIndex((token) => token.type === LexerTOKEN_TYPES.EOF)
	if (index === -1) throw ERROR.MissingEOFToken
	// cut till EOF token
	tokens = tokens.slice(0, index + 1)
	return new Program(tokens)
}
