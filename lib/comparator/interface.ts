import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/types";
import { C } from "./comparator";

export const interfaceComparator = C.chain<TSESTree.TypeElement>(
	C.when(
		shrink(AST_NODE_TYPES.TSPropertySignature),
		C.chain(
			C.property("computed", C.boolean),
			C.property(
				"key",
				C.when(shrink(AST_NODE_TYPES.Identifier), C.property("name", C.string)),
			),
		),
	),
	C.when(
		shrink(AST_NODE_TYPES.TSMethodSignature),
		C.chain(
			C.property("computed", C.boolean),
			C.property(
				"key",
				C.when(shrink(AST_NODE_TYPES.Identifier), C.property("name", C.string)),
			),
		),
	),
);

function shrink<K extends AST_NODE_TYPES>(key: K) {
	return function <N extends TSESTree.Node>(node: N): node is N & { type: K } {
		return node.type === key;
	};
}
