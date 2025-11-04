export const TOKEN_TYPES = {
	NEWLINE: "NEWLINE",
	UNKNOWN: "UNKNOWN",
	COMMENT: "COMMENT",

	IF: "IF",
	ELSEIF: "ELSEIF",
	ELSE: "ELSE",
	WHILE: "WHILE",
	BREAK: "BREAK",
	CONTINUE: "CONTINUE",
	FUNCTION: "FUNCTION",
	RETURN: "RETURN",

	BLOCK_START: "BLOCK_START",
	BLOCK_END: "BLOCK_END",

	INSTRUCTION: "INSTRUCTION",
	MATH: "MATH",
	STRING: "STRING",
	ARGUMENT: "ARGUMENT",
	LABEL: "LABEL",

	EOF: "EOF",
	ERROR: "ERROR",
} as const
export type TOKEN_TYPES = (typeof TOKEN_TYPES)[keyof typeof TOKEN_TYPES]

export const TOKENS: Array<
	| {
			token: Exclude<TOKEN_TYPES, "ERROR" | "UNKNOWN">
			patternType: "string"
			pattern: string | RegExp | (string | RegExp)[]
			/**
			 * If true, this token will only be matched if it is the first non-whitespace character in a line.
			 */
			firstInLine: boolean | null
	  }
	| {
			token: Exclude<TOKEN_TYPES, "ERROR" | "UNKNOWN">
			patternType: "range"
			firstInLine: boolean | null
			open: string | RegExp
			close: string | RegExp
			ignore?: string[]
			errorOn?: string[]
	  }
	| {
			token: Exclude<TOKEN_TYPES, "ERROR" | "UNKNOWN">
			patternType: "function"
			firstInLine: boolean | null
			pattern: (substr: string) => [length: number, value: string, error?: string] | null
	  }
> = [
	{
		token: TOKEN_TYPES.EOF,
		patternType: "string",
		firstInLine: null,
		pattern: "\u0003",
	},
	{
		token: TOKEN_TYPES.NEWLINE,
		patternType: "string",
		firstInLine: null,
		pattern: "\n",
	},
	{
		token: TOKEN_TYPES.COMMENT,
		patternType: "range",
		firstInLine: null,
		open: "#",
		close: "\n",
		ignore: ["\r"],
	},
	{
		token: TOKEN_TYPES.IF,
		patternType: "string",
		pattern: "if",
		firstInLine: true,
	},
	{
		token: TOKEN_TYPES.ELSEIF,
		patternType: "string",
		pattern: "elseif",
		firstInLine: true,
	},
	{
		token: TOKEN_TYPES.ELSE,
		patternType: "string",
		pattern: "else",
		firstInLine: true,
	},
	{
		token: TOKEN_TYPES.WHILE,
		patternType: "string",
		pattern: "while",
		firstInLine: true,
	},
	{
		token: TOKEN_TYPES.BREAK,
		patternType: "string",
		pattern: "break",
		firstInLine: true,
	},
	{
		token: TOKEN_TYPES.CONTINUE,
		patternType: "string",
		pattern: "continue",
		firstInLine: true,
	},
	{
		token: TOKEN_TYPES.FUNCTION,
		patternType: "string",
		pattern: "function",
		firstInLine: true,
	},
	{
		token: TOKEN_TYPES.RETURN,
		patternType: "string",
		pattern: "return",
		firstInLine: true,
	},
	{
		token: TOKEN_TYPES.BLOCK_START,
		patternType: "string",
		firstInLine: false,
		pattern: ["{", "do", "then"],
	},
	{
		token: TOKEN_TYPES.BLOCK_END,
		firstInLine: true,
		patternType: "string",
		pattern: ["}", "end"],
	},
	{
		token: TOKEN_TYPES.LABEL,
		patternType: "function",
		firstInLine: true,
		pattern: (substr) => {
			const regex = /^[a-zA-Z_]\w*:/
			const match = regex.exec(substr)
			if (match) return [match[0].length, match[0]]

			return null
		},
	},
	{
		token: TOKEN_TYPES.INSTRUCTION,
		patternType: "function",
		firstInLine: true,
		pattern: (substr) => {
			const regex = /^[a-zA-Z_]\w*/
			const match = regex.exec(substr)
			if (match) return [match[0].length, match[0]]

			return null
		},
	},
	{
		token: TOKEN_TYPES.STRING,
		patternType: "range",
		firstInLine: false,
		open: /\w?"/,
		close: '"',
		ignore: ['\\"'],
		errorOn: ["\n", "\r"],
	},
	{
		token: TOKEN_TYPES.STRING,
		patternType: "range",
		firstInLine: false,
		open: /\w?'/,
		close: "'",
		ignore: ["\\'"],
		errorOn: ["\n", "\r"],
	},
	{
		token: TOKEN_TYPES.MATH,
		patternType: "function",
		firstInLine: false,
		pattern: (substr) => {
			if (substr[0] !== "(") return null
			let depth = 0
			for (let i = 0; i < substr.length; i++) {
				if (substr[i] === "\u0003") {
					return [i, substr.slice(0, i), "Unclosed parenthesis"]
				}
				if (substr[i] === "(") depth++
				else if (substr[i] === ")") depth--
				if (depth === 0) {
					i++
					const value = substr.slice(0, i)
					return [i, value]
				}
			}
			return [substr.length, substr.slice(0, substr.length), "Unclosed parenthesis"]
		},
	},
	{
		token: TOKEN_TYPES.ARGUMENT,
		patternType: "function",
		firstInLine: false,
		pattern: (substr) => {
			// Any non-whitespace
			const regex = /^[a-zA-Z_]\w*(?:\.[a-zA-Z_]\w*)*/
			const match = regex.exec(substr)
			if (match) {
				return [match[0].length, match[0]]
			}
			return null
		},
	},
]
