import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/types";
import { Order } from "./comparator";

export function interfaceComparator(
	a: TSESTree.TypeElement,
	b: TSESTree.TypeElement,
): Order {
	if (a.type === AST_NODE_TYPES.TSPropertySignature) {
		if (b.type !== a.type) return Order.Less;
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
	}
	return Order.Less;
}
