import TOKEN_TYPES, { LexerToken, LexerTOKEN_TYPES, lexerBrakeTokens, Token, TokenInterface } from "../tokens"
import { createTokenError, ERROR, ErrorListing } from "../errors"
import VariableDeclarator from "./VariableDeclarator"

export class VariableDeclaration extends Token implements TokenInterface {
	readonly type = TOKEN_TYPES.VariableDeclaration
	readonly start: number
	readonly end: number
	readonly length: number
	readonly parent: TokenInterface | null
	readonly errors: ErrorListing[]
	readonly isCodeBlock: false = false
	readonly variables: undefined
	readonly constants: undefined
	readonly declarations: VariableDeclarator[] = []
	constructor(tokens: LexerToken[], parent: TokenInterface) {
		super()
		this.start = tokens[0]?.start ?? -1
		this.end = tokens[tokens.length - 1]?.end ?? -1
		this.length = this.end - this.start
		this.parent = parent
		this.errors = parent.errors

		let result = VariableDeclarator.parse(tokens, this)
		while (result !== null) {
			const x = result[0]
			if (VariableDeclarator.is(x)) {
				this.declarations.push(x)

			} else if (x !== null) {
				this.errors.push({
					error: ERROR.UnexpectedToken,
					start: x.start,
					end: x.end,
				})
			}
			result = VariableDeclarator.parse(result[1], this)
		}
	}
	static is(token: TokenInterface | null): token is VariableDeclaration {
		if (token === null) return false
		return token.type === TOKEN_TYPES.VariableDeclaration
	}
	static parse(tokens: LexerToken[], parent: TokenInterface): [VariableDeclaration, LexerToken[]] {
		const token = tokens[0]
		if (token.type !== LexerTOKEN_TYPES.LET) throw ERROR.InvalidToken
		// find end
		let index = 1
		while (!(tokens[index]?.type in lexerBrakeTokens) && index < tokens.length) index++
		const after = tokens.slice(1, index)
		const other = tokens.slice(index)
		const newToken = new VariableDeclaration(after, parent)
		return [newToken, other]
	}
}



export default VariableDeclaration
