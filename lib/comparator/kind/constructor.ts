import { AST_NODE_TYPES } from "@typescript-eslint/types";
import { MemberNode, MemberTypes } from "../../ast/member-like";
import { select } from "../select";
import { node } from "./utils";

export const isInterfaceConstructor: (
	node: MemberNode,
) => node is MemberNode<
	| AST_NODE_TYPES.TSConstructSignatureDeclaration
	| AST_NODE_TYPES.MethodDefinition
> = select.or(node(MemberTypes.TSConstructSignatureDeclaration)).or(
	select.and(
		node(MemberTypes.MethodDefinition),
		// eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
		($) => $.key.type === "Identifier" && $.key.name === "constructor",
	),
);
