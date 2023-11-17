import { AST_NODE_TYPES as Ty, TSESTree } from "@typescript-eslint/types";

export const select = {
	node<K extends Ty>(...keys: K[]) {
		return function <N extends TSESTree.Node>(
			node: N,
		): node is N & { type: K } {
			return keys.some((key) => node.type === key);
		};
	},
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

function or<T, U extends T, V extends T>(
	p1: (a: T) => a is U,
	p2: (a: T) => a is V,
): (a: T) => a is U | V;
function or<T, U extends T, V extends T, W extends T>(
	p1: (a: T) => a is U,
	p2: (a: T) => a is V,
	p3: (a: T) => a is W,
): (a: T) => a is U | V | W;
function or<T, U extends T, V extends T, W extends T, X extends T>(
	p1: (a: T) => a is U,
	p2: (a: T) => a is V,
	p3: (a: T) => a is W,
	p4: (a: T) => a is X,
): (a: T) => a is U | V | W | X;
function or<T, U extends T, V extends T, W extends T, X extends T, Y extends T>(
	p1: (a: T) => a is U,
	p2: (a: T) => a is V,
	p3: (a: T) => a is W,
	p4: (a: T) => a is X,
	p5: (a: T) => a is Y,
): (a: T) => a is U | V | W | X | Y;
function or<T>(...predicates: ((a: T) => boolean)[]): (a: T) => boolean {
	return (a) => predicates.some((predicate) => predicate(a));
}
