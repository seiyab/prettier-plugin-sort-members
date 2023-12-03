import { AST_NODE_TYPES } from "@typescript-eslint/types";
import { C, Comparator } from "./comparator";
import { Node } from "../ast";
import { isNode, isPrivateName } from "@babel/types";

export const keyIdentifierName = <
	T extends {
		key: Node;
	},
>(): Comparator<T> =>
	C.by(($) => {
		switch ($.key.type) {
			case AST_NODE_TYPES.Identifier:
			case AST_NODE_TYPES.PrivateIdentifier:
				return $.key.name;
		}
		if (isNode($.key) && isPrivateName($.key)) {
			if ($.key.id.type === AST_NODE_TYPES.Identifier) return $.key.id.name;
		}
		return null;
	}, C.maybe(C.string));
