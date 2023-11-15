import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/types";
import { C } from "./comparator";

export const interfaceComparator = C.chain<TSESTree.TypeElement>(
	C.when(
		shrink(AST_NODE_TYPES.TSPropertySignature, (n) => !n.computed),
		C.chain(
			C.property(
				"key",
				C.when(shrink(AST_NODE_TYPES.Identifier), C.property("name", C.string)),
			),
		),
	),
	C.when(
		shrink(AST_NODE_TYPES.TSMethodSignature, (n) => !n.computed),
		C.chain(
			C.property(
				"key",
				C.when(shrink(AST_NODE_TYPES.Identifier), C.property("name", C.string)),
			),
		),
	),
);

function shrink<K extends AST_NODE_TYPES>(
	key: K,
	...pred: ((node: TSESTree.Node & { type: K }) => boolean)[]
) {
	return function <N extends TSESTree.Node>(node: N): node is N & { type: K } {
		if (node.type !== key) return false;
		return pred.every((p) => p(node as any));
	};
}
