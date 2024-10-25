import { AST_NODE_TYPES } from "@typescript-eslint/types";
import { MemberNode, MemberTypes } from "../../ast/member-like";

export function isConstructor(
	node: MemberNode,
): node is MemberNode<
	| AST_NODE_TYPES.TSConstructSignatureDeclaration
	| AST_NODE_TYPES.MethodDefinition
	| "ClassMethod"
	| "ClassPrivateMethod"
> {
	switch (node.type) {
		case MemberTypes.TSConstructSignatureDeclaration:
			return true;
		case MemberTypes.MethodDefinition:
			return (
				node.key.type === AST_NODE_TYPES.Identifier &&
				node.key.name === "constructor"
			);
		case MemberTypes.ClassMethod:
		case MemberTypes.ClassPrivateMethod:
			return node.key.type === "Identifier" && node.key.name === "constructor";
	}
	return false;
}
