import bt from "@babel/types";
import { AST_NODE_TYPES } from "@typescript-eslint/types";
import { C, Comparator } from "./comparator";
import { MemberNode, MemberTypes } from "../ast/member-like";

export function accessibility<T extends MemberNode>(): Comparator<T> {
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
			case MemberTypes.PropertyDefinition:
			case MemberTypes.MethodDefinition:
			case MemberTypes.AccessorProperty:
				if ($.key.type === AST_NODE_TYPES.PrivateIdentifier) return 3;
				break;
			case MemberTypes.ClassPrivateMethod:
			case MemberTypes.ClassPrivateProperty:
				return 3;
			case MemberTypes.ClassAccessorProperty:
				if (bt.isPrivateName($.key)) return 3;
				break;
		}
		return 0;
	}, C.number);
}
