import { AST_NODE_TYPES } from "@typescript-eslint/types";
import { C, Comparator } from "./comparator";
import { BabelNodeTypes, Node } from "../ast";

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
			case BabelNodeTypes.PrivateName:
				if ($.key.id.type === AST_NODE_TYPES.Identifier) return $.key.id.name;
		}
		return null;
	}, C.maybe(C.string));
