import { GeneralTOKEN_TYPES, Token, TokenInterface } from "../tokens"
import AssignmentBlock from "./AssignmentBlock"
import CodeBlock from "./CodeBlock"
import ConstantAssignment from "./ConstantAssignment"
import ConstantDeclaration from "./ConstantDeclaration"
import ConstantDeclarator from "./ConstantDeclarator"
import FunctionArgument from "./FunctionArgument"
import FunctionCall from "./FunctionCall"
import FunctionStatement from "./FunctionStatement"
import Identifier from "./Identifier"
import HalfMathToken from "./math/HalfMathToken"
import MathToken from "./math/MathTokens"
import NumberToken from "./Number"
import Program from "./Program"
import StringToken from "./String"
import VariableAssignment from "./VariableAssignment"
import VariableDeclaration from "./VariableDeclaration"
import VariableDeclarator from "./VariableDeclarator"

export const Blocks = {
	MathToken: MathToken,
	HalfMathToken: HalfMathToken,
	Program: Program,
	CodeBlock: CodeBlock,
	VariableDeclaration: VariableDeclaration,
	VariableDeclarator: VariableDeclarator,
	VariableAssignment: VariableAssignment,
	ConstantDeclaration: ConstantDeclaration,
	ConstantDeclarator: ConstantDeclarator,
	ConstantAssignment: ConstantAssignment,
	AssignmentBlock: AssignmentBlock,
	Identifier: Identifier,
	StringToken: StringToken,
	NumberToken: NumberToken,
	FunctionCall: FunctionCall,
	FunctionArgument: FunctionArgument,
	FunctionStatement: FunctionStatement,
} as const satisfies Record<GeneralTOKEN_TYPES | "MathToken" | "HalfMathToken", Token | TokenInterface>
export type Blocks = {
	MathToken: MathToken,
	HalfMathToken: HalfMathToken,
	Program: Program,
	CodeBlock: CodeBlock,
	VariableDeclaration: VariableDeclaration,
	VariableDeclarator: VariableDeclarator,
	VariableAssignment: VariableAssignment,
	ConstantDeclaration: ConstantDeclaration,
	ConstantDeclarator: ConstantDeclarator,
	ConstantAssignment: ConstantAssignment,
	AssignmentBlock: AssignmentBlock,
	Identifier: Identifier,
	StringToken: StringToken,
	NumberToken: NumberToken,
	FunctionCall: FunctionCall,
	FunctionArgument: FunctionArgument,
	FunctionStatement: FunctionStatement,
}

