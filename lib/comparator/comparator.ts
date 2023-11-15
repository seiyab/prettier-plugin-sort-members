import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/types";

export const Order = {
	Less: -1,
	Equal: 0,
	Greater: 1,
};
export type Order = (typeof Order)[keyof typeof Order];

type Comparator<A> = (a: A, b: A) => number;

export function nodeComparator<N extends TSESTree.Node>() {
	const comparators: Partial<{
		[K in N["type"]]: Comparator<N & { type: K }>;
	}> = {};

	const builder = {
		type,
		build,
	};
	return builder;

	function type<T extends N["type"]>(
		type: T,
		comparator: Comparator<N & { type: T }>,
	): typeof builder {
		comparators[type] = comparator;
		return builder;
	}

	function build(): Comparator<N> {
		const typeOrder = new Map<N["type"], number>(
			Array.from(Object.keys(comparators)).map((type, index) => [
				type as N["type"],
				index,
			]),
		);

		return (a, b) => {
			if (a.type !== b.type) {
				const aOrder = typeOrder.get(a.type) ?? Number.MAX_SAFE_INTEGER;
				const bOrder = typeOrder.get(b.type) ?? Number.MAX_SAFE_INTEGER;
				if (aOrder < bOrder) return Order.Less;
				if (aOrder > bOrder) return Order.Greater;
				return Order.Equal;
			}
			return (
				comparators[a.type as keyof typeof comparators]?.(a, b) ?? Order.Equal
			);
		};
	}
}
