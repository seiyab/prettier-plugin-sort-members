import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/types";
import { C, Comparator } from "./comparator";

export function methodKind<T extends TSESTree.Node>(): Comparator<T> {
	return C.by(($) => {
		switch ($.type) {
			case AST_NODE_TYPES.TSMethodSignature:
			case AST_NODE_TYPES.MethodDefinition:
			case AST_NODE_TYPES.TSAbstractMethodDefinition:
				switch ($.kind) {
					case "constructor":
						return 0;
					case "get":
						return 1;
					case "set":
						return 2;
					case "method":
						return 3;
				}
		}
		return 4;
	}, C.number);
}
