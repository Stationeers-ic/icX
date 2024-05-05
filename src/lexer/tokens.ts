// identifier, keyword, delimiter, operator, literal, and comment.
export const TOKEN_TYPES = {
	LEFT_BRACE: "LEFT_BRACE",
	RIGHT_BRACE: "RIGHT_BRACE",
	LEFT_PARENTHESIS: "LEFT_PARENTHESIS",
	RIGHT_PARENTHESIS: "RIGHT_PARENTHESIS",
	COLON: "COLON",
	COMMA: "COMMA",
	STRING: "STRING",
	NUMBER: "NUMBER",
	TRUE: "TRUE",
	FALSE: "FALSE",
	NULL: "NULL",
	EOF: "EOF",
} as const
export type TOKEN_TYPES = (typeof TOKEN_TYPES)[keyof typeof TOKEN_TYPES]


export const TOKENS: Array<
	| {
			token: TOKEN_TYPES
			patternType: "string"
			pattern: string
	  }
	| {
			token: TOKEN_TYPES
			patternType: "strings"
			pattern: string[]
	  }
	| {
			token: TOKEN_TYPES
			patternType: "range"
			open: string
			close: string
			ignore?: string[]
			errorOn?: string[]
	  }
	| {
			token: TOKEN_TYPES
			patternType: "function"
			pattern: (position: number, sliced: string, total: string) => number
	  }
> = [
	{
		token: TOKEN_TYPES.LEFT_BRACE,
		patternType: "string",
		pattern: "{",
	},
	{
		token: TOKEN_TYPES.RIGHT_BRACE,
		patternType: "string",
		pattern: "}",
	},
	{
		token: TOKEN_TYPES.LEFT_PARENTHESIS,
		patternType: "string",
		pattern: "(",
	},
	{
		token: TOKEN_TYPES.RIGHT_PARENTHESIS,
		patternType: "string",
		pattern: ")",
	},
	{
		token: TOKEN_TYPES.COLON,
		patternType: "string",
		pattern: ":",
	},
	{
		token: TOKEN_TYPES.COMMA,
		patternType: "string",
		pattern: ",",
	},
	{
		token: TOKEN_TYPES.STRING,
		patternType: "range",
		open: '"',
		close: '"',
		ignore: ['\\"'],
		errorOn: ['\n'],
	},
	{
		token: TOKEN_TYPES.NUMBER,
		patternType: "function",
		// pattern: /-?\d+(?:\.\d+)?/,
		pattern: (position, sliced, total) => {
			const reg = /[+-]?\d[_\d]*(?:\.[_\d]*)?/
			const match = reg.exec(sliced)
			// if start position is 0 return 0
			// else return length of match
			return match ? match[0].length : 0
		},
	},
	{
		token: TOKEN_TYPES.TRUE,
		patternType: "string",
		pattern: "true",
	},
	{
		token: TOKEN_TYPES.FALSE,
		patternType: "string",
		pattern: "false",
	},
	{
		token: TOKEN_TYPES.NULL,
		patternType: "string",
		pattern: "null",
	},
]
