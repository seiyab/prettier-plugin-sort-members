import { AST_NODE_TYPES } from "@typescript-eslint/types";
import { C, Comparator } from "./comparator";
import { select } from "./select";
import { Node } from "../ast";

export const keyIdentifierName = <
	T extends {
		key: Node;
	},
>(): Comparator<T> =>
	C.property(
		"key",
		C.capture(
			select.node(AST_NODE_TYPES.Identifier),
			C.property("name", C.string),
		),
	);
