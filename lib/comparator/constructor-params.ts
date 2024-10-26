import bt from "@babel/types";
import { AST_NODE_TYPES } from "@typescript-eslint/types";
import { C, Comparator } from "./comparator";
import { MemberNode, MemberTypes } from "../ast/member-like";

export function constructorParams(): Comparator<
	MemberNode<
		| AST_NODE_TYPES.TSConstructSignatureDeclaration
		| AST_NODE_TYPES.MethodDefinition
		| "ClassMethod"
		| "ClassPrivateMethod"
	>
> {
	return C.by(($) => {
		if ($.type !== MemberTypes.TSConstructSignatureDeclaration) return 0;
		return (
			$.params?.length ??
			($ as unknown as bt.TSConstructSignatureDeclaration).parameters.length
		);
	}, C.number);
}
