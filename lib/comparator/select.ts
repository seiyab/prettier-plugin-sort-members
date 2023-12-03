export const select = {
	and,
	or,
	not<T>(predicate: (a: T) => boolean): (a: T) => boolean {
		return (a) => !predicate(a);
	},
};

function and<T, U extends T, V extends U>(
	p1: (a: T) => a is U,
	p2: (a: U) => a is V,
	...predicates: ((a: U) => boolean)[]
): (a: T) => a is U & V;
function and<T, U extends T>(
	p1: (a: T) => a is U,
	...predicates: ((a: U) => boolean)[]
): (a: T) => a is U;
function and<T>(...predicates: ((a: T) => boolean)[]): (a: T) => boolean {
	return (a) => predicates.every((predicate) => predicate(a));
}

type Or<T, U extends T> = ((a: T) => a is U) & {
	or<V extends T>(predicate: (a: T) => a is V): Or<T, U | V>;
};

function or<T, U extends T>(predicate: (a: T) => a is U): Or<T, U> {
	function call(a: T): a is U {
		return predicate(a);
	}
	call.or = function <V extends T>(predicate: (a: T) => a is V) {
		return or((a: T): a is U | V => predicate(a) || call(a));
	};
	return call;
}
