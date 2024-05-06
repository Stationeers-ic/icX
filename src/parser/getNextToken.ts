
import TOKEN_TYPES, { lexerCalculationTokens, Token, TokenInterface } from "./tokens"
import { type Token as LexerToken, TOKEN_TYPES as LexerTOKEN_TYPES } from "../lexer"
import { createTokenError, ERROR, ErrorListing } from "./errors"
import { parse } from '../lexer/index';
import VariableDeclaration from "./tokens/VariableDeclaration"
import Identifier from "./tokens/Identifier"
import StringToken from "./tokens/String"
import NumberToken from "./tokens/Number"

export function getNextToken(tokens: LexerToken[], parent: TokenInterface): [TokenInterface | null, LexerToken[]] | null {
	const token = tokens[0]
	if (token === undefined) return null
	const nextTokens = tokens.slice(1)
	if (token.type in lexerCalculationTokens) {
		// evaluate math
		console.log("evaluate math")
	}
	switch (token.type) {
		case LexerTOKEN_TYPES.LET:
			return VariableDeclaration.parse(tokens, parent)
		case LexerTOKEN_TYPES.IDENTIFIER:
			return Identifier.parse(tokens, parent)
		case LexerTOKEN_TYPES.STRING:
			return StringToken.parse(tokens, parent)
		case LexerTOKEN_TYPES.NUMBER:
			return NumberToken.parse(tokens, parent)
		case LexerTOKEN_TYPES.EOF:
			return null
		default:
			parent.errors.push(createTokenError(ERROR.UnexpectedToken, token))
			return [null, nextTokens]
	}
	throw new Error("Unreachable")
}
