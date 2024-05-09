import { describe, test, expect } from "bun:test"
import { getNextToken, parse, Token } from "../index"
import RandExp, { randexp } from "randexp"
import { TOKEN_TYPES, TOKENS } from "../tokens"

describe("getNextToken", () => {
	test("Test", () => {
		expect(getNextToken(0, "5")).toMatchSnapshot()
		expect(getNextToken(1, "5i")).toMatchSnapshot()
	})
})
describe("parse", () => {
	test("allStringTokens", () => {
		TOKENS.filter((t) => t.patternType === "string").forEach((token) => {
			try {
				expect(parse(token.pattern)[0]?.[0]?.type).toBe(token.token)
			} catch (e: any) {
				console.log("On test token:", token)
				throw e.message
			}
		})
	})
	describe("allRangeTokens", () => {
		test("basic", () => {
			TOKENS.filter((t) => t.patternType === "range").forEach((token) => {
				expect(parse(`${token.open} ${token.close}`)[0]?.[0]?.type).toBe(token.token)

				const testString = new RandExp(".{5,50}[^\\\\]")
				;(token.open + token.close).split("").forEach((item) => {
					testString.defaultRange.subtract(item.charCodeAt(0))
				})
				for (let i = 0; i < 50; i++) {
					const v = `${token.open}${testString.gen()}${token.close}`
					try {
						expect(parse(v)[0]?.[0]?.type).toBe(token.token)
						expect(parse(v)[0]?.length).toBe(2)
					} catch (e: any) {
						console.log("On test token:", token, "With value:", v)
						throw e.message
					}
				}
			})
		})
		test("ignore", () => {
			TOKENS.filter((t) => t.patternType === "range").forEach((token) => {
				const ignore = token.ignore
				if (!ignore) return
				expect(parse(`${token.open} ${token.close}`)[0]?.[0]?.type).toBe(token.token)

				const testString = new RandExp(".{2,8}[^\\\\]")
				;(token.open + token.close).split("").forEach((item) => {
					testString.defaultRange.subtract(item.charCodeAt(0))
				})
				for (let i = 0; i < 50; i++) {
					ignore.forEach((item) => {
						const v = `${token.open}${item}${testString.gen()}${item}${testString.gen()}${item}${token.close}`
						try {
							expect(parse(v)[0]?.[0]?.type).toBe(token.token)
							expect(parse(v)[0]?.length).toBe(2)
						} catch (e: any) {
							console.log("On test token:", token, "With value:", v)
							throw e.message
						}
					})
				}
			})
		})
		test("errorOn", () => {
			TOKENS.filter((t) => t.patternType === "range").forEach((token) => {
				const errorOn = token.errorOn ?? []
				expect(parse(`${token.open} ${token.close}`)[0]?.[0]?.type).toBe(token.token)

				const testString = new RandExp(".{2,8}[^\\\\]")
				;(token.open + token.close).split("").forEach((item) => {
					testString.defaultRange.subtract(item.charCodeAt(0))
				})
				for (let i = 0; i < 50; i++) {
					;[...errorOn, "\u0003"].forEach((item) => {
						const v = `${token.open}${testString.gen()}${item}${testString.gen()}${token.close}`
						try {
							expect(parse(v)[0]?.[0]?.type).toBe(token.token)
							if (item !== "\u0003") expect(parse(v)[0]?.length).not.toBe(2)
							else expect(parse(v)[0]?.length).toBe(2)
						} catch (e: any) {
							console.log("On test token:", token, "With value:", v)
							item === "\u0003" && console.log("(\\u0003)")
							throw e.message
						}
					})
				}
			})
		})
	})
	describe("allFunctionTokens", () => {
		const testCases: Record<string, [string, len: number, value:any][]> = {}
		testCases[TOKEN_TYPES.COMMENT] = [
			["// comment", 2],
			["//comment\n10", 4],
		]
		testCases[TOKEN_TYPES.NUMBER] = [
			["9.1"]




		]
		const usedCases: string[] = []
		test("TestCases", () => {
			TOKENS.filter((t) => t.patternType === "function").forEach((token) => {
				usedCases.push(token.token)
				try {
					expect(Object.keys(testCases)).toContain(token.token)
				} catch (e: any) {
					console.log("No test cases for:", token.token)
					throw e.message
				}
				testCases[token.token].forEach(([c, len]) => {
					try {
						expect(parse(c)[0]?.[0]?.type).toBe(token.token)
						expect(parse(c)[0]?.length).toBe(len)
					} catch (e: any) {
						console.log("On test case:", c)
						throw e.message
					}
				})
			})
		})

		test("AllCasesUsed", () => {
			usedCases.forEach((key) => {
				try {
					expect(usedCases).toContain(key)
				} catch (e: any) {
					console.log("Unused case:", key)
					throw e.message
				}
			})
		})
	})
	describe("generalTokens", () => {
		;["100", "i100", "i 100", "'100'", '"100"', "x()", "5+x (5-5)", "+x", "x+", "x"].forEach((c) => {
			test(c, () => {
				expect(parse(c)).toMatchSnapshot(c)
			})
		})
		test("empty", () => {
			expect(parse("")).toMatchSnapshot()
		})
	})
})
