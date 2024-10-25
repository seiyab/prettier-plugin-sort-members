import { MemberNode, MemberTypes } from "../../ast/member-like";

export function isAccessor(node: MemberNode): boolean {
	switch (node.type) {
		case MemberTypes.AccessorProperty:
		case MemberTypes.ClassAccessorProperty:
			return true;
		default:
			return false;
	}
}
