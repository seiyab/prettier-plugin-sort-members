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

type Captured<T, U> = Comparator<T> & {
	then: (comp: Comparator<U>) => Comparator<T>;
};

function capture<T, U extends T>(
	this: void,
	pred: (a: T) => a is U,
): Captured<T, U>;
function capture<T>(this: void, pred: (a: T) => boolean): Comparator<T>;
function capture<T, U extends T>(
	this: void,
	pred: (a: T) => boolean,
): Captured<T, U> {
	function then(comp: Comparator<U>): Comparator<T> {
		return (a, b) => {
			if (pred(a) && pred(b)) return comp(a as U, b as U);
			if (pred(a)) return Order.Less;
			if (pred(b)) return Order.Greater;
			return Order.Equal;
		};
	}
	const captured = then(nop) as Captured<T, U>;
	captured.then = then;

	return captured;
}

export const C = {
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
	capture,
};
