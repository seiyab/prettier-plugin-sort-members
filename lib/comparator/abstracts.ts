import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/types";
import { C, Comparator } from "./comparator";

export function abstracts<T extends TSESTree.Node>(): Comparator<T> {
	return C.by(($) => {
		switch ($.type) {
			case AST_NODE_TYPES.TSAbstractPropertyDefinition:
			case AST_NODE_TYPES.TSAbstractMethodDefinition:
				return true;
		}
		return false;
	}, C.defer);
}
