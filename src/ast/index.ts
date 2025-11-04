import type { CODE_TOKEN } from "@lexer"
import { BlockNode } from "./BlockNode"
import type { ErrorMessage } from "./Types"

export function createTree(tokens: CODE_TOKEN[]): { ast: BlockNode; errors: ErrorMessage[] } {
	const errors: ErrorMessage[] = []
	const ast = BlockNode.create(tokens, errors, true)
	if (!ast) {
		return {
			ast: new BlockNode(-1, -1, null, []),
			errors,
		}
	}
	return {
		ast: ast[0],
		errors,
	}
}
export default createTree
