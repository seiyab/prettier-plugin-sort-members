import { MemberNode, MemberTypes } from "../../ast/member-like";
import { functionExpressions } from "../../ast";
import { AST_NODE_TYPES } from "@typescript-eslint/types";

export function isMethod(
	node: MemberNode,
): node is MemberNode<
	| AST_NODE_TYPES.TSMethodSignature
	| AST_NODE_TYPES.MethodDefinition
	| AST_NODE_TYPES.TSAbstractMethodDefinition
	| "TSDeclareMethod"
	| "ClassMethod"
	| "ClassPrivateMethod"
	| AST_NODE_TYPES.PropertyDefinition
	| AST_NODE_TYPES.TSPropertySignature
	| "ClassProperty"
	| "ClassPrivateProperty"
> {
	switch (node.type) {
		case MemberTypes.TSMethodSignature:
		case MemberTypes.MethodDefinition:
		case MemberTypes.TSAbstractMethodDefinition:
		case MemberTypes.TSDeclareMethod:
			return true;
		case MemberTypes.ClassMethod:
		case MemberTypes.ClassPrivateMethod:
			return true;
		case MemberTypes.PropertyDefinition:
		case MemberTypes.ClassProperty:
		case MemberTypes.ClassPrivateProperty:
			return (
				node.value != null && functionExpressions.includes(node.value.type)
			);
		case MemberTypes.TSPropertySignature:
			return true;
		default:
			return false;
	}
}
