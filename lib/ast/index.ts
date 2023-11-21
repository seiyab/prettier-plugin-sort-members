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
	ClassPrivateProperty = "ClassPrivateProperty",
	ClassMethod = "ClassMethod",
	ClassPrivateMethod = "ClassPrivateMethod",
	TSDeclareMethod = "TSDeclareMethod",
	PrivateName = "PrivateName",
	File = "File",
}
// type BabelNodeTypes = (typeof BabelNodeTypes)[keyof typeof BabelNodeTypes];

type BabelNode =
	| ClassProperty
	| ClassPrivateProperty
	| ClassMethod
	| ClassPrivateMethod
	| TSDeclareMethod
	| PrivateName
	| File;

type ClassProperty = Override<
	TSESTree.PropertyDefinition,
	{ type: BabelNodeTypes.ClassProperty; abstract: boolean; key: Node }
>;

type ClassPrivateProperty = Override<
	ClassProperty,
	{ type: BabelNodeTypes.ClassPrivateProperty }
>;

type ClassMethod = Override<
	TSESTree.MethodDefinition,
	{ type: BabelNodeTypes.ClassMethod; key: Node }
>;

type ClassPrivateMethod = Override<
	ClassMethod,
	{ type: BabelNodeTypes.ClassPrivateMethod }
>;

type TSDeclareMethod = Override<
	TSESTree.TSAbstractMethodDefinition,
	{ type: BabelNodeTypes.TSDeclareMethod; abstract: boolean; key: Node }
>;

type PrivateName = {
	type: BabelNodeTypes.PrivateName;
	id: Node;
};

type File = {
	type: BabelNodeTypes.File;
	program: Node;
};

type Override<T, U> = Omit<T, keyof U> & U;
