import bt from "@babel/types";
import { MemberNode, MemberTypes } from "../../ast/member-like";
import { select } from "../select";
import { node } from "./utils";
import { functionExpressions } from "../../ast";

export const isField: (node: MemberNode) => boolean = select
	.or(node(MemberTypes.TSPropertySignature))
	.or(
		select.and(
			select
				.or(node(MemberTypes.PropertyDefinition))
				.or(node(MemberTypes.TSAbstractPropertyDefinition))
				.or(
					select.and(
						bt.isNode,
						select.or(bt.isClassProperty).or(bt.isClassPrivateProperty),
					),
				),
			($) => !($.value && functionExpressions.includes($.value.type)),
		),
	);
