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
