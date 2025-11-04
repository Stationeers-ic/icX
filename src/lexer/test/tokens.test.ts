import { describe, expect, it } from "bun:test"
import { TOKEN_TYPES, TOKENS } from "../tokens"

// const arr: string[] = ["ERROR", "UNKNOWN"]
// for (const i in TOKENS) {
// 	arr.push(TOKENS[i].token)
// }
// for (const val of Object.values(TOKEN_TYPES)) {
// 	if (!arr.includes(val)) console.error(val)
// }

describe("TOKEN_TYPES completeness", () => {
	it("should have all tokens in TOKEN_TYPES", () => {
		const arr: string[] = ["UNKNOWN", "ERROR"]
		for (const i in TOKENS) {
			arr.push(TOKENS[i].token)
		}
		for (const val of Object.values(TOKEN_TYPES)) {
			expect(arr).toContain(val)
		}
	})
	it("should have all tokens in TOKENS", () => {
		const tokens = Object.values(TOKEN_TYPES)
		for (const i in TOKENS) {
			const token = TOKENS[i].token
			expect(tokens).toContain(token)
		}
	})
})
