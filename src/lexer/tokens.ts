// identifier, keyword, delimiter, operator, literal, and comment.
export const TOKEN_TYPES = {
	NEWLINE: "NEWLINE",
	LEFT_BRACE: "LEFT_BRACE",
	RIGHT_BRACE: "RIGHT_BRACE",
	LEFT_PARENTHESIS: "LEFT_PARENTHESIS",
	RIGHT_PARENTHESIS: "RIGHT_PARENTHESIS",
	COLON: "COLON",
	SEMICOLON: "SEMICOLON",
	DOT: "DOT",
	COMMA: "COMMA",
	INCREMENT: "INCREMENT",
	DECREMENT: "DECREMENT",
	ARROW: "ARROW",
	// Relational operators
	LESS_THAN: "LESS_THAN",
	GREATER_THAN: "GREATER_THAN",
	// Equality operators
	EQUAL: "EQUAL",
	NOT_EQUAL: "NOT_EQUAL",
	//assign
	ASSIGNMENT: "ASSIGNMENT",
	EXPONENTIATION_ASSIGNMENT: "EXPONENTIATION_ASSIGNMENT",
	MULTIPLICATION_ASSIGNMENT: "MULTIPLICATION_ASSIGNMENT",
	DIVISION_ASSIGNMENT: "DIVISION_ASSIGNMENT",
	REMAINDER_ASSIGNMENT: "REMAINDER_ASSIGNMENT",
	ADDITION_ASSIGNMENT: "ADDITION_ASSIGNMENT",
	SUBTRACTION_ASSIGNMENT: "SUBTRACTION_ASSIGNMENT",
	//bitwise assignment
	BITWISE_AND_ASSIGNMENT: "BITWISE_AND_ASSIGNMENT",
	BITWISE_OR_ASSIGNMENT: "BITWISE_OR_ASSIGNMENT",
	BITWISE_XOR_ASSIGNMENT: "BITWISE_XOR_ASSIGNMENT",
	BITWISE_LEFT_SHIFT_ASSIGNMENT: "BITWISE_LEFT_SHIFT_ASSIGNMENT",
	BITWISE_RIGHT_SHIFT_ARITHMETIC_ASSIGNMENT: "BITWISE_RIGHT_SHIFT_ARITHMETIC_ASSIGNMENT",
	BITWISE_RIGHT_SHIFT_LOGICAL_ASSIGNMENT: "BITWISE_RIGHT_SHIFT_LOGICAL_ASSIGNMENT",
	// logical assignment
	LOGICAL_AND_ASSIGNMENT: "LOGICAL_AND_ASSIGNMENT",
	LOGICAL_OR_ASSIGNMENT: "LOGICAL_OR_ASSIGNMENT",
	// Arithmetic operators
	EXPONENTIATION: "EXPONENTIATION",
	MULTIPLICATION: "MULTIPLICATION",
	DIVISION: "DIVISION",
	REMAINDER: "REMAINDER",
	ADDITION: "ADDITION",
	SUBTRACTION: "SUBTRACTION",
	// Logical operators
	LOGICAL_AND: "LOGICAL_AND",
	LOGICAL_OR: "LOGICAL_OR",
	LOGICAL_NOT: "LOGICAL_NOT",
	// Bitwise operators
	BITWISE_AND: "BITWISE_AND",
	BITWISE_OR: "BITWISE_OR",
	BITWISE_XOR: "BITWISE_XOR",
	BITWISE_NOT: "BITWISE_NOT",
	BITWISE_RIGHT_SHIFT_LOGICAL: "BITWISE_RIGHT_SHIFT_LOGICAL",
	BITWISE_LEFT_SHIFT: "BITWISE_LEFT_SHIFT",
	BITWISE_RIGHT_SHIFT_ARITHMETIC: "BITWISE_RIGHT_SHIFT_ARITHMETIC",

	LESS_THAN_EQUAL: "LESS_THAN_EQUAL",
	GREATER_THAN_EQUAL: "GREATER_THAN_EQUAL",
	// Keywords
	IF: "IF",
	ELSE: "ELSE",
	SWITCH: "SWITCH",
	CASE: "CASE",
	DEFAULT: "DEFAULT",
	DO: "DO",
	WHILE: "WHILE",
	FOR: "FOR",
	BREAK: "BREAK",
	CONTINUE: "CONTINUE",
	LET: "LET",
	CONST: "CONST",
	FUNCTION: "FUNCTION",
	RETURN: "RETURN",
	TRUE: "TRUE",
	FALSE: "FALSE",
	NULL: "NULL",
	STRING: "STRING",
	NUMBER: "NUMBER",
	IDENTIFIER: "IDENTIFIER",
	COMMENT: "COMMENT",
	// Special
	UNKNOWN: "UNKNOWN",
	EOF: "EOF",
	ERROR: "ERROR",
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
			patternType: "range"
			open: string
			close: string
			ignore?: string[]
			errorOn?: string[]
	  }
	| {
			token: TOKEN_TYPES
			patternType: "function"
			pattern: (position: number, total: string) => [length: number, value: any, error?: string] | null
	  }
> = [
	{
		token: TOKEN_TYPES.EOF,
		patternType: "string",
		pattern: "\u0003",
	},
	{
		token: TOKEN_TYPES.NEWLINE,
		patternType: "string",
		pattern: "\n",
	},
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
		token: TOKEN_TYPES.SEMICOLON,
		patternType: "string",
		pattern: ";",
	},
	{
		token: TOKEN_TYPES.DOT,
		patternType: "string",
		pattern: ".",
	},
	{
		token: TOKEN_TYPES.COMMA,
		patternType: "string",
		pattern: ",",
	},
	{
		token: TOKEN_TYPES.INCREMENT,
		patternType: "string",
		pattern: "++",
	},
	{
		token: TOKEN_TYPES.DECREMENT,
		patternType: "string",
		pattern: "--",
	},
	{
		token: TOKEN_TYPES.ARROW,
		patternType: "string",
		pattern: "=>",
	},
	{
		token: TOKEN_TYPES.COMMENT,
		patternType: "range",
		open: "/*",
		close: "*/",
	},
	{
		token: TOKEN_TYPES.COMMENT,
		patternType: "function",
		pattern: (position, total) => {
			const reg = /^\/\/[^\n\x03]*/
			const match = reg.exec(total.slice(position))
			// if start position is 0 return 0
			// else return length of match
			if (match === null) return null
			return [match[0].length, match[0].slice(2)]
		},
	},
	{
		token: TOKEN_TYPES.LESS_THAN_EQUAL,
		patternType: "string",
		pattern: "<=",
	},
	{
		token: TOKEN_TYPES.GREATER_THAN_EQUAL,
		patternType: "string",
		pattern: ">=",
	},
	{
		token: TOKEN_TYPES.EQUAL,
		patternType: "string",
		pattern: "==",
	},
	{
		token: TOKEN_TYPES.NOT_EQUAL,
		patternType: "string",
		pattern: "!=",
	},
	{
		token: TOKEN_TYPES.ASSIGNMENT,
		patternType: "string",
		pattern: "=",
	},
	{
		token: TOKEN_TYPES.EXPONENTIATION_ASSIGNMENT,
		patternType: "string",
		pattern: "**=",
	},
	{
		token: TOKEN_TYPES.MULTIPLICATION_ASSIGNMENT,
		patternType: "string",
		pattern: "*=",
	},
	{
		token: TOKEN_TYPES.DIVISION_ASSIGNMENT,
		patternType: "string",
		pattern: "/=",
	},
	{
		token: TOKEN_TYPES.REMAINDER_ASSIGNMENT,
		patternType: "string",
		pattern: "%=",
	},
	{
		token: TOKEN_TYPES.ADDITION_ASSIGNMENT,
		patternType: "string",
		pattern: "+=",
	},
	{
		token: TOKEN_TYPES.SUBTRACTION_ASSIGNMENT,
		patternType: "string",
		pattern: "-=",
	},
	{
		token: TOKEN_TYPES.BITWISE_AND_ASSIGNMENT,
		patternType: "string",
		pattern: "&=",
	},
	{
		token: TOKEN_TYPES.BITWISE_OR_ASSIGNMENT,
		patternType: "string",
		pattern: "|=",
	},
	{
		token: TOKEN_TYPES.BITWISE_XOR_ASSIGNMENT,
		patternType: "string",
		pattern: "^=",
	},
	{
		token: TOKEN_TYPES.BITWISE_LEFT_SHIFT_ASSIGNMENT,
		patternType: "string",
		pattern: "<<=",
	},
	{
		token: TOKEN_TYPES.BITWISE_RIGHT_SHIFT_ARITHMETIC_ASSIGNMENT,
		patternType: "string",
		pattern: ">>=",
	},
	{
		token: TOKEN_TYPES.BITWISE_RIGHT_SHIFT_LOGICAL_ASSIGNMENT,
		patternType: "string",
		pattern: ">>>=",
	},
	{
		token: TOKEN_TYPES.LOGICAL_AND_ASSIGNMENT,
		patternType: "string",
		pattern: "&&=",
	},
	{
		token: TOKEN_TYPES.LOGICAL_OR_ASSIGNMENT,
		patternType: "string",
		pattern: "||=",
	},
	{
		token: TOKEN_TYPES.EXPONENTIATION,
		patternType: "string",
		pattern: "**",
	},
	{
		token: TOKEN_TYPES.MULTIPLICATION,
		patternType: "string",
		pattern: "*",
	},
	{
		token: TOKEN_TYPES.DIVISION,
		patternType: "string",
		pattern: "/",
	},
	{
		token: TOKEN_TYPES.REMAINDER,
		patternType: "string",
		pattern: "%",
	},
	{
		token: TOKEN_TYPES.ADDITION,
		patternType: "string",
		pattern: "+",
	},
	{
		token: TOKEN_TYPES.SUBTRACTION,
		patternType: "string",
		pattern: "-",
	},
	{
		token: TOKEN_TYPES.LOGICAL_AND,
		patternType: "string",
		pattern: "&&",
	},
	{
		token: TOKEN_TYPES.LOGICAL_OR,
		patternType: "string",
		pattern: "||",
	},
	{
		token: TOKEN_TYPES.LOGICAL_NOT,
		patternType: "string",
		pattern: "!",
	},
	{
		token: TOKEN_TYPES.BITWISE_AND,
		patternType: "string",
		pattern: "&",
	},
	{
		token: TOKEN_TYPES.BITWISE_OR,
		patternType: "string",
		pattern: "|",
	},
	{
		token: TOKEN_TYPES.BITWISE_XOR,
		patternType: "string",
		pattern: "^",
	},
	{
		token: TOKEN_TYPES.BITWISE_NOT,
		patternType: "string",
		pattern: "~",
	},
	{
		token: TOKEN_TYPES.BITWISE_LEFT_SHIFT,
		patternType: "string",
		pattern: "<<",
	},
	{
		token: TOKEN_TYPES.BITWISE_RIGHT_SHIFT_LOGICAL,
		patternType: "string",
		pattern: ">>>",
	},
	{
		token: TOKEN_TYPES.BITWISE_RIGHT_SHIFT_ARITHMETIC,
		patternType: "string",
		pattern: ">>",
	},
	{
		token: TOKEN_TYPES.LESS_THAN,
		patternType: "string",
		pattern: "<",
	},
	{
		token: TOKEN_TYPES.GREATER_THAN,
		patternType: "string",
		pattern: ">",
	},
	{
		token: TOKEN_TYPES.IF,
		patternType: "string",
		pattern: "if",
	},
	{
		token: TOKEN_TYPES.ELSE,
		patternType: "string",
		pattern: "else",
	},
	{
		token: TOKEN_TYPES.SWITCH,
		patternType: "string",
		pattern: "switch",
	},
	{
		token: TOKEN_TYPES.CASE,
		patternType: "string",
		pattern: "case",
	},
	{
		token: TOKEN_TYPES.DEFAULT,
		patternType: "string",
		pattern: "default",
	},
	{
		token: TOKEN_TYPES.DO,
		patternType: "string",
		pattern: "do",
	},
	{
		token: TOKEN_TYPES.WHILE,
		patternType: "string",
		pattern: "while",
	},
	{
		token: TOKEN_TYPES.FOR,
		patternType: "string",
		pattern: "for",
	},
	{
		token: TOKEN_TYPES.BREAK,
		patternType: "string",
		pattern: "break",
	},
	{
		token: TOKEN_TYPES.CONTINUE,
		patternType: "string",
		pattern: "continue",
	},
	{
		token: TOKEN_TYPES.LET,
		patternType: "string",
		pattern: "var",
	},
	{
		token: TOKEN_TYPES.LET,
		patternType: "string",
		pattern: "let",
	},
	{
		token: TOKEN_TYPES.CONST,
		patternType: "string",
		pattern: "const",
	},
	{
		token: TOKEN_TYPES.FUNCTION,
		patternType: "string",
		pattern: "function",
	},
	{
		token: TOKEN_TYPES.RETURN,
		patternType: "string",
		pattern: "return",
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
	{
		token: TOKEN_TYPES.STRING,
		patternType: "range",
		open: '"',
		close: '"',
		ignore: ['\\"'],
		errorOn: ["\n"],
	},
	{
		token: TOKEN_TYPES.STRING,
		patternType: "range",
		open: "'",
		close: "'",
		ignore: ["\\'"],
		errorOn: ["\n"],
	},
	{
		token: TOKEN_TYPES.NUMBER,
		patternType: "function",
		// pattern: /-?\d+(?:\.\d+)?/,
		pattern: (position, total) => {
			const reg = /^\d[_\d]*(?:\.[_\d]+)?/
			const match = reg.exec(total.slice(position))
			// if start position is 0 return 0
			// else return length of match
			if (match === null) return null
			if (isNaN(Number(match[0].replaceAll("_", "")))) return null
			return [match[0].length, Number(match[0].replaceAll("_", ""))]
		},
	},
	{
		token: TOKEN_TYPES.IDENTIFIER,
		patternType: "function",
		// pattern: /[a-zA-Z_$][a-zA-Z0-9_$]*/,
		pattern: (position, total) => {
			const reg = /^[a-zA-Z_]\w*/
			const match = reg.exec(total.slice(position))
			// if start position is 0 return 0
			// else return length of match
			if (match === null) return null
			return [match[0].length, match[0]]
		},
	},
]
const arr: string[] = ["ERROR", "UNKNOWN"]
for (const i in TOKENS) {
	arr.push(TOKENS[i].token)
}
for (const val of Object.values(TOKEN_TYPES)) {
	if (!arr.includes(val)) console.error(val)
}
