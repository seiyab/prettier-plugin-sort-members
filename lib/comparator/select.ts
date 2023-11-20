import { Node, NodeTypes } from "../ast";

export const select = {
	node,
	and,
	or,
	not<T>(predicate: (a: T) => boolean): (a: T) => boolean {
		return (a) => !predicate(a);
	},
};

function node<K extends NodeTypes>(key: K): (node: Node) => node is Node<K>;
function node<K1 extends NodeTypes, K2 extends NodeTypes>(
	key1: K1,
	key2: K2,
): (node: Node) => node is Node<K1 | K2>;
function node<K1 extends NodeTypes, K2 extends NodeTypes, K3 extends NodeTypes>(
	key1: K1,
	key2: K2,
	key3: K3,
): (node: Node) => node is Node<K1 | K2 | K3>;
function node<K extends NodeTypes>(...keys: K[]) {
	return function (node: Node): node is Node<K> {
		return keys.some((key) => node.type === key);
	};
}

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
function or<
	T,
	U extends T,
	V extends T,
	W extends T,
	X extends T,
	Y extends T,
	Z extends T,
>(
	p1: (a: T) => a is U,
	p2: (a: T) => a is V,
	p3: (a: T) => a is W,
	p4: (a: T) => a is X,
	p5: (a: T) => a is Y,
	p6: (a: T) => a is Z,
): (a: T) => a is U | V | W | X | Y | Z;
function or<T>(...predicates: ((a: T) => boolean)[]): (a: T) => boolean {
	return (a) => predicates.some((predicate) => predicate(a));
}
