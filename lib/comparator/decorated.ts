import { AST_NODE_TYPES } from "@typescript-eslint/types";
import { Node } from "../ast";

export function decorated(node: Node): boolean {
	switch (node.type) {
		case AST_NODE_TYPES.PropertyDefinition:
		case AST_NODE_TYPES.MethodDefinition:
			return node.decorators.length > 0;
	}
	return false;
}
