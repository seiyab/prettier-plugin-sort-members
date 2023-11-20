import { AST_NODE_TYPES } from "@typescript-eslint/types";
import { C, Comparator } from "./comparator";
import { BabelNodeTypes, Node } from "../ast";

export function methodKind<T extends Node>(): Comparator<T> {
	return C.by(($) => {
		switch ($.type) {
			case AST_NODE_TYPES.TSMethodSignature:
			case AST_NODE_TYPES.MethodDefinition:
			case AST_NODE_TYPES.TSAbstractMethodDefinition:
			case BabelNodeTypes.ClassMethod:
			case BabelNodeTypes.TSDeclareMethod:
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
		return 3;
	}, C.number);
}
