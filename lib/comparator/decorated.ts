import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/types";

export function decorated(node: TSESTree.Node): boolean {
	switch (node.type) {
		case AST_NODE_TYPES.PropertyDefinition:
		case AST_NODE_TYPES.MethodDefinition:
			return node.decorators.length > 0;
	}
	return false;
}
