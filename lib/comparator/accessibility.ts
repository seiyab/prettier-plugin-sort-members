import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/types";
import { C, Comparator, Order } from "./comparator";

export function accessibility<T extends TSESTree.Node>(): Comparator<T> {
	return C.by(($) => {
		if ("accessibility" in $) {
			switch ($.accessibility) {
				case "public":
					return 0;
				case "protected":
					return 1;
				case "private":
					return 2;
			}
		}
		if (
			$.type === AST_NODE_TYPES.PropertyDefinition ||
			$.type === AST_NODE_TYPES.MethodDefinition
		) {
			if ($.key.type === AST_NODE_TYPES.PrivateIdentifier) return 3;
		}
		return 0;
	}, C.number);
}
