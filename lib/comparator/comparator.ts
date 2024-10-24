export const Order = {
	Less: -1,
	Equal: 0,
	Greater: 1,
};
export type Order = (typeof Order)[keyof typeof Order];

export type Comparator<A> = (a: A, b: A) => number;

function nop(this: void): Order {
	return Order.Equal;
}

export const C = {
	property<T, K extends keyof T>(
		this: void,
		key: K,
		comp: Comparator<T[K]>,
	): Comparator<T> {
		return (a, b) => {
			return comp(a[key], b[key]);
		};
	},
	by<T, U>(this: void, fn: ($: T) => U, comp: Comparator<U>): Comparator<T> {
		return (a, b) => {
			return comp(fn(a), fn(b));
		};
	},
	chain<T>(this: void, ...comps: Comparator<T>[]): Comparator<T> {
		return (a, b) => {
			for (const comp of comps) {
				const res = comp(a, b);
				if (res !== Order.Equal) return res;
			}
			return Order.Equal;
		};
	},
	nop,
	defer(this: void, a: boolean, b: boolean): Order {
		if (!!a === !!b) return Order.Equal;
		if (a) return Order.Greater;
		return Order.Less;
	},
	prefer(this: void, a: boolean, b: boolean): Order {
		if (Boolean(a) === Boolean(b)) return Order.Equal;
		if (a) return Order.Less;
		return Order.Greater;
	},
	string(this: void, a: string, b: string): Order {
		if (a < b) return Order.Less;
		if (a > b) return Order.Greater;
		return Order.Equal;
	},
	number(this: void, a: number, b: number): Order {
		if (a < b) return Order.Less;
		if (a > b) return Order.Greater;
		return Order.Equal;
	},
	maybe<T>(this: void, comp: Comparator<T>): Comparator<T | undefined | null> {
		return (a, b) => {
			if (a == null) {
				if (b == null) return Order.Equal;
				return Order.Greater;
			}
			if (b == null) return Order.Less;
			return comp(a, b);
		};
	},
	reverse<T>(this: void, comp: Comparator<T>): Comparator<T> {
		return (a, b) => comp(b, a);
	},
	capture<T, U extends T>(
		this: void,
		pred: (a: T) => a is U,
		comp: Comparator<U> = nop,
	): Comparator<T> {
		return (a, b) => {
			if (pred(a)) {
				if (pred(b)) return comp(a, b);
				return Order.Less;
			}
			if (pred(b)) return Order.Greater;
			return Order.Equal;
		};
	},
};
