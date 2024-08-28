import { and, or, sla, sra, srl, xor } from "stationeers-bitwise-functions"
import { TOKEN_TYPES } from "../lexer/tokens"
import type { LexerToken, TokenInterface } from "../parser/tokens"
import { Blocks } from "../parser/tokens/index"
import type MathToken from "../parser/tokens/math/MathTokens"

function newNumberToken(left: Blocks["NumberToken"], right: Blocks["NumberToken"], value: number, parent: TokenInterface): Blocks["NumberToken"] {
	const len = right.end - left.start
	const fakeToken: LexerToken = {
		type: TOKEN_TYPES.NUMBER,
		value: value,
		start: left.start,
		end: right.end,
		length: len < 0 ? 0 : len,
	}
	return new Blocks.NumberToken(fakeToken, parent)
}

export function mathSimplifier(block: MathToken): Blocks["NumberToken"] | MathToken {
	if (Blocks.NumberToken.is(block.left) && Blocks.NumberToken.is(block.right)) {
		const left = block.left.value
		const right = block.right.value
		switch (block.type) {
			case "Addition":
				return newNumberToken(block.left, block.right, left + right, block.parent)
			case "Subtraction":
				return newNumberToken(block.left, block.right, left - right, block.parent)
			case "Multiplication":
				return newNumberToken(block.left, block.right, left * right, block.parent)
			case "Division":
				return newNumberToken(block.left, block.right, left / right, block.parent)
			case "Exponentiation":
				return newNumberToken(block.left, block.right, left ** right, block.parent)
			case "Remainder":
				let num = left % right
				if (num < 0) num += right
				return newNumberToken(block.left, block.right, num, block.parent)
			case "LessThan":
				return newNumberToken(block.left, block.right, Number(left < right), block.parent)
			case "GreaterThan":
				return newNumberToken(block.left, block.right, Number(left > right), block.parent)
			case "Equal":
				return newNumberToken(block.left, block.right, Number(left == right), block.parent)
			case "NotEqual":
				return newNumberToken(block.left, block.right, Number(left != right), block.parent)
			case "LessThanEqual":
				return newNumberToken(block.left, block.right, Number(left <= right), block.parent)
			case "GreaterThanEqual":
				return newNumberToken(block.left, block.right, Number(left >= right), block.parent)
			case "LogicalAnd":
				return newNumberToken(block.left, block.right, Number(left && right), block.parent)
			case "LogicalOr":
				return newNumberToken(block.left, block.right, Number(left || right), block.parent)
			case "BitwiseAnd":
				const andR = and(left, right)
				if (andR === null) return block
				return newNumberToken(block.left, block.right, andR, block.parent)
			case "BitwiseOr":
				const orR = or(left, right)
				if (orR === null) return block
				return newNumberToken(block.left, block.right, orR, block.parent)
			case "BitwiseXor":
				const xorR = xor(left, right)
				if (xorR === null) return block
				return newNumberToken(block.left, block.right, xorR, block.parent)
			case "LeftShift":
				const slaR = sla(left, right)
				if (slaR === null) return block
				return newNumberToken(block.left, block.right, slaR, block.parent)
			case "RightShiftArithmetic":
				const sraR = sra(left, right)
				if (sraR === null) return block
				return newNumberToken(block.left, block.right, sraR, block.parent)
			case "RightShiftLogical":
				const srlR = srl(left, right)
				if (srlR === null) return block
				return newNumberToken(block.left, block.right, srlR, block.parent)
			default:
				return block
		}
	}
	return block
}

// Dot: "Dot",
