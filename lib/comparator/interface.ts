import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/types";
import { Order, nodeComparator } from "./comparator";

export const interfaceComparator = nodeComparator<TSESTree.TypeElement>()
	.type(AST_NODE_TYPES.TSPropertySignature, (a, b) => {
		if (a.computed) {
			if (b.computed) return Order.Equal;
			return Order.Greater;
		}
		if (b.computed) return Order.Less;
		const aKey = a.key;
		const bKey = b.key;
		if (aKey.type === AST_NODE_TYPES.Identifier && aKey.type === bKey.type) {
			if (aKey.name < bKey.name) return Order.Less;
			if (aKey.name > bKey.name) return Order.Greater;
			return Order.Equal;
		}
		return Order.Equal;
	})
	.build();
