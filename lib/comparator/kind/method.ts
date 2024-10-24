import bt from "@babel/types";
import { MemberNode, MemberTypes } from "../../ast/member-like";
import { select } from "../select";
import { node } from "./utils";
import { functionExpressions } from "../../ast";
import { AST_NODE_TYPES } from "@typescript-eslint/types";

export const isMethod: (
	node: MemberNode,
) => node is MemberNode<
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
> = select
	.or(node(MemberTypes.TSMethodSignature))
	.or(node(MemberTypes.MethodDefinition))
	.or(node(MemberTypes.TSAbstractMethodDefinition))
	.or(node(MemberTypes.TSDeclareMethod))
	.or(
		select.and(
			bt.isNode,
			select.or(bt.isClassMethod).or(bt.isClassPrivateMethod),
		),
	)
	.or(
		select.and(
			select
				.or(node(MemberTypes.PropertyDefinition))
				.or(
					select.and(
						bt.isNode,
						select.or(bt.isClassProperty).or(bt.isClassPrivateProperty),
					),
				),
			($) => $.value != null && functionExpressions.includes($.value.type),
		),
	)
	.or(node(MemberTypes.TSPropertySignature));
