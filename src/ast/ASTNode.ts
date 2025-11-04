import type { CODE_TOKEN } from "@/lexer"
import type { NodeMap } from "./BlockNode"
import type { AST_NODE_TYPE, ErrorMessage } from "./Types"

export abstract class ASTNode {
		abstract readonly type: AST_NODE_TYPE
		abstract readonly start: number
		abstract readonly end: number
		is<T extends keyof NodeMap>(type: T): this is NodeMap[T] {
			return this.type === type
		}
		abstract toString(): string
		// @ts-expect-error reason: This method is intended to be static, but TypeScript does not allow static abstract methods.
		create(): never {}

		static create(tokens: CODE_TOKEN[], errors: ErrorMessage[]): null | [node: ASTNode, next: CODE_TOKEN[]] {
			// Implement node creation logic here
			throw new Error("Method not implemented.")
		}
	}
