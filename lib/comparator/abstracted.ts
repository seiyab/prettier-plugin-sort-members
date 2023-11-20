import { AST_NODE_TYPES } from "@typescript-eslint/types";
import { BabelNodeTypes, Node } from "../ast";

export function abstracted(node: Node): boolean {
	switch (node.type) {
		case AST_NODE_TYPES.TSAbstractPropertyDefinition:
		case AST_NODE_TYPES.TSAbstractMethodDefinition:
			return true;
		case BabelNodeTypes.ClassProperty:
		case BabelNodeTypes.TSDeclareMethod:
			return node.abstract;
	}
	return false;
}
