import { MemberNode, MemberType } from "../../ast/member-like";

export function node<K extends MemberType>(key: K) {
	return function (node: MemberNode): node is MemberNode<K> {
		return node.type === key;
	};
}
