import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/types";
import { type Node as BabelNode } from "@babel/types";

export type BabelNodeTypes = Exclude<BabelNode["type"], never>;

export const functionExpressions: NodeTypes[] = [
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
