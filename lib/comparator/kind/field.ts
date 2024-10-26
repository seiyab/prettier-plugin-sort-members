import { MemberNode, MemberTypes } from "../../ast/member-like";
import { functionExpressions } from "../../ast";

export function isField(node: MemberNode): boolean {
	switch (node.type) {
		case MemberTypes.TSPropertySignature:
			return true;
		case MemberTypes.PropertyDefinition:
		case MemberTypes.TSAbstractPropertyDefinition:
		case MemberTypes.ClassProperty:
		case MemberTypes.ClassPrivateProperty:
			return !node.value || !functionExpressions.includes(node.value.type);
		default:
			return false;
	}
}
