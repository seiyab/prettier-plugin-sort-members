import { AST_NODE_TYPES } from "@typescript-eslint/types";
import { C, Comparator } from "./comparator";
import { BabelNodeTypes, Node } from "../ast";

export function accessibility<T extends Node>(): Comparator<T> {
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
		switch ($.type) {
			case AST_NODE_TYPES.PropertyDefinition:
			case AST_NODE_TYPES.MethodDefinition:
				if ($.key.type === AST_NODE_TYPES.PrivateIdentifier) return 3;
				break;
			case BabelNodeTypes.ClassPrivateMethod:
			case BabelNodeTypes.ClassPrivateProperty:
				return 3;
		}
		return 0;
	}, C.number);
}
