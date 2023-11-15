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

export const C = {
	property<T, K extends keyof T>(
		key: K,
		comp: Comparator<T[K]>,
	): Comparator<T> {
		return (a, b) => {
			return comp(a[key], b[key]);
		};
	},
	chain<T>(...comps: Comparator<T>[]): Comparator<T> {
		return (a, b) => {
			for (const comp of comps) {
				const res = comp(a, b);
				if (res !== Order.Equal) return res;
			}
			return Order.Equal;
		};
	},
	boolean(a: boolean, b: boolean): Order {
		if (a === b) return Order.Equal;
		if (a) return Order.Greater;
		return Order.Less;
	},
	string(a: string, b: string): Order {
		if (a < b) return Order.Less;
		if (a > b) return Order.Greater;
		return Order.Equal;
	},
	maybe<T>(comp: Comparator<T>): Comparator<T | undefined | null> {
		return (a, b) => {
			if (a == null) {
				if (b == null) return Order.Equal;
				return Order.Less;
			}
			if (b == null) return Order.Greater;
			return comp(a, b);
		};
	},
};
