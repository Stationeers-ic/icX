import { and, or, sla, sra, srl, xor } from "stationeers-bitwise-functions"
import { TOKEN_TYPES } from "../lexer/tokens"
import type { LexerToken, TokenInterface } from "../parser/tokens"
import { Blocks } from "../parser/tokens/index"
import type MathToken from "../parser/tokens/math/MathTokens"

function newNumberToken(left: TokenInterface, right: TokenInterface, value: number, parent: TokenInterface): Blocks["NumberToken"] {
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
	const left = block.left
	const right = block.right
	if (Blocks.NumberToken.is(left) && Blocks.NumberToken.is(right)) {
		const leftValue = left.value
		const rightValue = right.value
		let value: number | null = null
		console.log(`leftValue: ${leftValue}, rightValue: ${rightValue}, type: ${block.type}`);
		switch (block.type) {
			case "Addition":
				value = leftValue + rightValue
				break
			case "Subtraction":
				value = leftValue - rightValue
				break
			case "Multiplication":
				value = leftValue * rightValue
				break
			case "Division":
				value = leftValue / rightValue
				break
			case "Exponentiation":
				value = leftValue ** rightValue
				break
			case "Remainder":
				value = leftValue % rightValue
				if (value < 0) value += rightValue
				break
			case "LessThan":
				value = Number(leftValue < rightValue)
				break
			case "GreaterThan":
				value = Number(leftValue > rightValue)
				break
			case "Equal":
				value = Number(leftValue == rightValue)
				break
			case "NotEqual":
				value = Number(leftValue != rightValue)
				break
			case "LessThanEqual":
				value = Number(leftValue <= rightValue)
				break
			case "GreaterThanEqual":
				value = Number(leftValue >= rightValue)
				break
			case "LogicalAnd":
				value = Number(leftValue && rightValue)
				break
			case "LogicalOr":
				value = Number(leftValue || rightValue)
				break
			case "BitwiseAnd":
				value = and(leftValue, rightValue)
				break
			case "BitwiseOr":
				value = or(leftValue, rightValue)
				break
			case "BitwiseXor":
				value = xor(leftValue, rightValue)
				break
			case "LeftShift":
				value = sla(leftValue, rightValue)
				break
			case "RightShiftArithmetic":
				value = sra(leftValue, rightValue)
				break
			case "RightShiftLogical":
				value = srl(leftValue, rightValue)
				break
			default:
				return block
		}
		if (value === null) return block
		return newNumberToken(left, right, value, block.parent)
	}
	if (Blocks.Identifier.is(left) && Blocks.Identifier.is(right)) {
		const leftName = left.name
		const rightName = right.name
		if (block.type === "Division" && leftName === rightName) {
			return newNumberToken(left, right, 1, block.parent)
		}
	}
	return block
}

// Dot: "Dot",
