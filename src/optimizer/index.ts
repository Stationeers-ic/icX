
import TOKEN_TYPES, { TokenInterface } from "../parser/tokens"
import { Blocks } from "../parser/tokens/index"
import Program from "../parser/tokens/Program"
import { mathSimplifier } from "./MathSimplifier"




const optimizations = {
	Program: function (block: TokenInterface): Blocks["Program"] | null {
		const working = Blocks.Program.is(block) ? block : null
		if (working === null) {
			console.log(`Warning: Expected Program block, got ${block.type}`)
			return null
		}

		next(working.body)
		return working
	},
	CodeBlock: function (block: TokenInterface): Blocks["CodeBlock"] | null {
		const working = Blocks.CodeBlock.is(block) ? block : null
		if (working === null) {
			console.log(`Warning: Expected CodeBlock block, got ${block.type}`)
			return null
		}

		if (working.statements.length === 0) return null
		working.statements = working.statements
			.map((statement) => {
				const n = next(statement)
				if (n === undefined) return statement
				return n
			})
			.filter((statement) => statement !== null)
		return working
	},
	VariableDeclaration: function (block: TokenInterface): Blocks["VariableDeclaration"] | null {
		const working = Blocks.VariableDeclaration.is(block) ? block : null
		if (working === null) {
			console.log(`Warning: Expected VariableDeclaration block, got ${block.type}`)
			return null
		}

		if (working.declarations.length === 0) return null
		working.declarations = working.declarations
			.map((declarations) => {
				const n = next(declarations)
				if (n === undefined) return declarations
				return n as Blocks["VariableDeclarator"] | null
			})
			.filter((declarations) => declarations !== null)
		return working
	},
	VariableDeclarator: function (block: TokenInterface): Blocks["VariableDeclarator"] | null {
		const working = Blocks.VariableDeclarator.is(block) ? block : null
		if (working === null) {
			console.log(`Warning: Expected VariableDeclarator block, got ${block.type}`)
			return null
		}

		if (working.init !== null) {
			const n = next(working.init)
			if (n !== undefined) working.init = n
		}
		return working
	},
	VariableAssignment: function (block: TokenInterface): TokenInterface {
		throw new Error("Function not implemented.")
	},
	ConstantDeclaration: function (block: TokenInterface): TokenInterface {
		throw new Error("Function not implemented.")
	},
	ConstantDeclarator: function (block: TokenInterface): TokenInterface {
		throw new Error("Function not implemented.")
	},
	ConstantAssignment: function (block: TokenInterface): TokenInterface {
		throw new Error("Function not implemented.")
	},
	AssignmentBlock: function (block: TokenInterface): TokenInterface {
		throw new Error("Function not implemented.")
	},
	Identifier: function (block: TokenInterface): Blocks["Identifier"] | null {
		const working = Blocks.Identifier.is(block) ? block : null
		if (working === null) {
			console.log(`Warning: Expected Identifier block, got ${block.type}`)
			return null
		}
		return working
	},
	StringToken: function (block: TokenInterface): TokenInterface {
		throw new Error("Function not implemented.")
	},
	NumberToken: function (block: TokenInterface): Blocks["NumberToken"] | null {
		const working = Blocks.NumberToken.is(block) ? block : null
		if (working === null) {
			console.log(`Warning: Expected NumberToken block, got ${block.type}`)
			return null
		}
		return working
	},
	FunctionCall: function (block: TokenInterface): TokenInterface {
		throw new Error("Function not implemented.")
	},
	FunctionArgument: function (block: TokenInterface): TokenInterface {
		throw new Error("Function not implemented.")
	},
	FunctionStatement: function (block: TokenInterface): TokenInterface {
		throw new Error("Function not implemented.")
	},
	MathToken: function (block: TokenInterface): Blocks["MathToken"] | Blocks["NumberToken"] | null {
		const working = Blocks.MathToken.is(block) ? block : null
		if (working === null) {
			console.log(`Warning: Expected MathToken block, got ${block.type}`)
			return null
		}

		working.left = next(working.left) ?? working.left
		working.right = next(working.right) ?? working.right
		return mathSimplifier(working)
	},
	HalfMathToken: function (block: TokenInterface): TokenInterface {
		throw new Error("Function not implemented.")
	},
} as const satisfies Record<keyof typeof Blocks, (block: TokenInterface) => TokenInterface | null>
// type in optimizations
function isOptimizable(type: string): type is keyof typeof Blocks {
	return type in optimizations
}

function next(block: TokenInterface): TokenInterface | undefined | null {
	console.log(block.type)
	if (Blocks.MathToken.is(block)) {
		return optimizations.MathToken(block)
	}
	if (Blocks.HalfMathToken.is(block)) {
		return optimizations.HalfMathToken(block)
	}
	if (isOptimizable(block.type))
		return optimizations[block.type](block)
	// if (Blocks.Program.is(block)) {
	// 	return optimizations.Program(block)
	// }
	// if (Blocks.CodeBlock.is(block)) {
	// 	return optimizations.CodeBlock(block)
	// }
	return undefined
}



export function optimizeProgram(program: Program) {
	return next(program)
}
