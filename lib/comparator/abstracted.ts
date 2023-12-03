import { Node } from "../ast";
import { MemberTypes } from "../ast/member-like";

export function abstracted(node: Node): boolean {
	switch (node.type) {
		case MemberTypes.TSAbstractPropertyDefinition:
		case MemberTypes.TSAbstractMethodDefinition:
			return true;
		case MemberTypes.ClassProperty:
		case MemberTypes.TSDeclareMethod:
			return node.abstract === true;
	}
	return false;
}
