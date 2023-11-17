import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/types";
import { C, Comparator } from "./comparator";

export function decoration<T extends TSESTree.Node>(): Comparator<T> {
	return C.by(($) => {
		switch ($.type) {
			case AST_NODE_TYPES.PropertyDefinition:
			case AST_NODE_TYPES.MethodDefinition:
				return $.decorators.length === 0;
		}
		return true;
	}, C.boolean);
}
