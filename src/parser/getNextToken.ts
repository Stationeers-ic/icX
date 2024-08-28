import TOKEN_TYPES, {
	LexerToken,
	LexerTOKEN_TYPES,
	isLexerToken,
	lexerCalculationTokens,
	Token,
	TokenInterface,
} from "./tokens"
import { createTokenError, ERROR, ErrorListing } from "./errors"
import VariableDeclaration from "./tokens/VariableDeclaration"
import Identifier from "./tokens/Identifier"
import StringToken from "./tokens/String"
import NumberToken from "./tokens/Number"
import { evaluateMath } from "./evaluateMath"
import FunctionCall from "./tokens/FunctionCall"
import ConstantDeclaration from "./tokens/ConstantDeclaration"
import CodeBlock from "./tokens/CodeBlock"

/**
 *
 * @returns {null | [TokenInterface | null, LexerToken[]]} null if no next token, otherwise [token?, next tokens]
 */
export function getNextToken(
	tokens: LexerToken[],
	parent: TokenInterface,
): [TokenInterface | null, LexerToken[]] | null {
	const token = tokens[0]
	// if no next token exit with null
	if (token === undefined) return null
	const nextTokens = tokens.slice(1)
	if (token.type in lexerCalculationTokens) {
		// evaluate math
		const math = evaluateMath(tokens, parent)
		if (math !== null) return math
	}

	switch (token.type) {
		case LexerTOKEN_TYPES.LEFT_BRACE:
			return CodeBlock.parse(tokens, parent)
		case LexerTOKEN_TYPES.CONST:
			return ConstantDeclaration.parse(tokens, parent)
		case LexerTOKEN_TYPES.LET:
			return VariableDeclaration.parse(tokens, parent)
		case LexerTOKEN_TYPES.IDENTIFIER:
			return Identifier.parse(tokens, parent)
		case LexerTOKEN_TYPES.STRING:
			return StringToken.parse(tokens, parent)
		case LexerTOKEN_TYPES.NUMBER:
			return NumberToken.parse(tokens, parent)
		case LexerTOKEN_TYPES.FUNCTION_CALL:
			return FunctionCall.parse(tokens, parent)
		// case LexerTOKEN_TYPES.IF:
		// 	return FunctionCall.parse(tokens, parent)
		case LexerTOKEN_TYPES.EOF:
		case LexerTOKEN_TYPES.RIGHT_BRACE:
			return null
		default:
			parent.errors.push(createTokenError(ERROR.UnexpectedToken, token))
			return [null, nextTokens]
	}
	throw new Error("Unreachable")
}
