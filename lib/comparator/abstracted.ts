import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/types";

export function abstracted(node: TSESTree.Node): boolean {
	switch (node.type) {
		case AST_NODE_TYPES.TSAbstractPropertyDefinition:
		case AST_NODE_TYPES.TSAbstractMethodDefinition:
			return true;
	}
	return false;
}
