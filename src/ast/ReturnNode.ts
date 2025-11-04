import type { CODE_TOKEN } from "@lexer"
import { TOKEN_TYPES } from "@lexer/tokens"
import { ASTNode } from "./ASTNode"
import { AST_NODE_TYPE, type ErrorMessage } from "./Types"

export class ReturnNode extends ASTNode {
	readonly type = AST_NODE_TYPE.RETURN
	constructor(
		readonly start: number = -1,
		readonly end: number = -1,
		readonly comment: string | null = null,
		readonly value: ASTNode | null = null,
	) {
		super()
	}
	toString(): string {
		return "break"
	}
	static create(tokens: CODE_TOKEN[], errors: ErrorMessage[]): null | [node: ReturnNode, next: CODE_TOKEN[]] {
		if (tokens[0].type !== TOKEN_TYPES.RETURN) return null
		// match till newline token, mark all between as error tokens
		const token = tokens[0]
		let comment: string | null = null
		const unexpectedTokens: CODE_TOKEN[] = []
		for (let i = 1; i < tokens.length; i++) {
			if (tokens[i].type === TOKEN_TYPES.NEWLINE) {
				if (unexpectedTokens.length > 0) {
					errors.push({
						type: "UNEXPECTED",
						start: unexpectedTokens[0].start,
						end: unexpectedTokens[unexpectedTokens.length - 1].end,
						tokens: unexpectedTokens,
					})
				}
				return [new ReturnNode(token.start, token.end, comment), tokens.slice(i + 1)]
			}
			if (tokens[i].type === TOKEN_TYPES.COMMENT) {
				comment = tokens[i].value ?? null
			} else {
				unexpectedTokens.push(tokens[i])
			}
		}
		return [new ReturnNode(token.start, token.end), []]
	}
}
