import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/types";
import { C, Comparator } from "./comparator";
import { select } from "./select";

export const keyIdentifierName = <
	T extends {
		key: TSESTree.Node;
	},
>(): Comparator<T> =>
	C.property(
		"key",
		C.when<TSESTree.Node, TSESTree.Identifier>(
			select.node(AST_NODE_TYPES.Identifier),
			C.property("name", C.string),
		),
	);
