import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/types";

export const functionExpressions = [
	AST_NODE_TYPES.FunctionExpression,
	AST_NODE_TYPES.ArrowFunctionExpression,
];

export type NodeTypes = AST_NODE_TYPES | BabelNodeTypes;
export type Node<T extends NodeTypes = NodeTypes> = (
	| TSESTree.Node
	| BabelNode
) & {
	type: T;
};

// --- babel specific nodes
export enum BabelNodeTypes {
	ClassProperty = "ClassProperty",
	ClassMethod = "ClassMethod",
	TSDeclareMethod = "TSDeclareMethod",
	PrivateName = "PrivateName",
	File = "File",
}
// type BabelNodeTypes = (typeof BabelNodeTypes)[keyof typeof BabelNodeTypes];

type BabelNode =
	| ClassProperty
	| ClassMethod
	| TSDeclareMethod
	| PrivateName
	| File;

type ClassProperty = Override<
	TSESTree.PropertyDefinition,
	{ type: BabelNodeTypes.ClassProperty; abstract: boolean; key: Node }
>;

type ClassMethod = Override<
	TSESTree.MethodDefinition,
	{ type: BabelNodeTypes.ClassMethod; key: Node }
>;

type TSDeclareMethod = Override<
	TSESTree.TSAbstractMethodDefinition,
	{ type: BabelNodeTypes.TSDeclareMethod; abstract: boolean; key: Node }
>;

type PrivateName = {
	type: BabelNodeTypes.PrivateName;
	id: TSESTree.Identifier;
};

type File = {
	type: BabelNodeTypes.File;
	program: Node;
};

type Override<T, U> = Omit<T, keyof U> & U;
