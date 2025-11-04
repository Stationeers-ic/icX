import type { CODE_TOKEN } from "@lexer"
import { TOKEN_TYPES } from "@/lexer/tokens"
import { ASTNode } from "./ASTNode"
import { BreakNode } from "./BreakNode"
import { ContinueNode } from "./ContinueNode"
import { ReturnNode } from "./ReturnNode"
import { AST_NODE_TYPE, type ErrorMessage } from "./Types"

export class BlockNode extends ASTNode {
	readonly type = AST_NODE_TYPE.BLOCK
	constructor(
		readonly start: number = -1,
		readonly end: number = -1,
		readonly comment: string | null = null,
		readonly body: ASTNode[] = [],
	) {
		super()
	}
	toString(): string {
		throw new Error("Method not implemented.")
	}
	static create(
		tokens: CODE_TOKEN[],
		errors: ErrorMessage[],
		first = false,
	): null | [node: BlockNode, next: CODE_TOKEN[]] {
		const body: ASTNode[] = []
		let comment: string | null = null
		let cutTokens = tokens
		let startIndex = -1
		let endIndex = -1
		if (!first) {
			if (tokens[0].type !== TOKEN_TYPES.BLOCK_START) return null
			// match till newline token, mark all between as error tokens
			const token = tokens[0]
			startIndex = token.start
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
					cutTokens = tokens.slice(i + 1)
					break
				}
				if (tokens[i].type === TOKEN_TYPES.COMMENT) {
					comment = tokens[i].value ?? null
				} else {
					unexpectedTokens.push(tokens[i])
				}
			}
		}
		for (const [key,Key] of Object.entries(NodeMap)) {
			if (cutTokens.length === 0 || cutTokens[0].type === TOKEN_TYPES.EOF) {
				errors.push({
					type: "NO_CLOSING",
					start: startIndex,
					end: cutTokens.length > 0 ? cutTokens[cutTokens.length - 1].end : startIndex,
					tokens: [],
				})
				break
			}
			if (cutTokens[0].type === TOKEN_TYPES.BLOCK_END) {
				endIndex = cutTokens[0].end
				cutTokens = cutTokens.slice(1)
				break
			}
			const result = Key.create(cutTokens, errors)
			console.log(`Trying to parse ${key}...`, result)
			if (!result) continue
			const [node, nextTokens] = result
			body.push(node)
			cutTokens = nextTokens
		}
		return [new BlockNode(startIndex, endIndex, comment, body), cutTokens]
	}
}
export const NodeMap = {
	// [AST_NODE_TYPE.FUNCTION]: FunctionNode
	// [AST_NODE_TYPE.WHILE]: WhileNode
	// [AST_NODE_TYPE.IF]: IfNode
	[AST_NODE_TYPE.BLOCK]: BlockNode,
	[AST_NODE_TYPE.BREAK]: BreakNode,
	[AST_NODE_TYPE.CONTINUE]: ContinueNode,
	[AST_NODE_TYPE.RETURN]: ReturnNode,
	// [AST_NODE_TYPE.MATH]: MathNode
	// [AST_NODE_TYPE.STRING]: StringNode
	// [AST_NODE_TYPE.ARGUMENT]: ArgumentNode
	// [AST_NODE_TYPE.LABEL]: LabelNode
	// [AST_NODE_TYPE.COMMENT]: CommentNode
	// [AST_NODE_TYPE.INSTRUCTION]: InstructionNode
} as const
export type NodeMap = {
	[Key in keyof typeof NodeMap]: InstanceType<(typeof NodeMap)[Key]>
}
