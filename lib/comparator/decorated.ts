import { Node } from "../ast";
import { MemberTypes } from "../ast/member-like";

export function decorated(node: Node): boolean {
	switch (node.type) {
		case MemberTypes.PropertyDefinition:
		case MemberTypes.MethodDefinition:
		case MemberTypes.ClassProperty:
		case MemberTypes.ClassPrivateProperty:
		case MemberTypes.ClassMethod:
		case MemberTypes.ClassPrivateMethod:
			return (node.decorators?.length ?? 0) > 0;
	}
	return false;
}
