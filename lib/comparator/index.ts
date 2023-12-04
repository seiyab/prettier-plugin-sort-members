import { AST_NODE_TYPES } from "@typescript-eslint/types";
import bt from "@babel/types";
import { C, Comparator } from "./comparator";
import { select } from "./select";
import { keyIdentifierName } from "./key-identifier-name";
import { functionExpressions } from "../ast";
import { accessibility } from "./accessibility";
import { decorated } from "./decorated";
import { abstracted } from "./abstracted";
import { methodKind } from "./method-kind";
import { MemberNode, MemberType, MemberTypes } from "../ast/member-like";
import { classMember } from "./class-member";

export type Options = {
	sortMembersAlphabetically?: boolean;
};

export function comparator(options: Partial<Options>): Comparator<MemberNode> {
	const alpha = options.sortMembersAlphabetically === true;
	return C.chain<MemberNode>(
		// signature
		C.capture(
			node(MemberTypes.TSIndexSignature),
			C.by(functionSignature, C.defer),
		),

		// field
		C.capture(
			select
				.or(
					select.and(
						node(MemberTypes.TSPropertySignature),
						select.not(functionSignature),
					),
				)
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
				),
			C.chain(
				classMember(),
				C.by(decorated, C.prefer),
				C.by(abstracted, C.defer),
				accessibility(),
				alpha ? keyIdentifierName() : C.nop,
			),
		),

		// constructor signature for interface
		// constructor in class is handled as method
		C.capture(
			select
				.or(node(MemberTypes.TSConstructSignatureDeclaration))
				.or(
					select.and(
						node(MemberTypes.MethodDefinition),
						($) => $.key.type === "Identifier" && $.key.name === "constructor",
					),
				),
			C.by(($) => {
				if ($.type !== MemberTypes.TSConstructSignatureDeclaration) return 0;
				return (
					$.params?.length ??
					($ as unknown as bt.TSConstructSignatureDeclaration).parameters.length
				);
			}, C.number),
		),

		// method
		C.capture(
			select
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
						($) =>
							$.value != null && functionExpressions.includes($.value.type),
					),
				)
				.or(
					select.and(node(MemberTypes.TSPropertySignature), functionSignature),
				),
			C.chain(
				methodKind(),
				classMember(),
				C.by(decorated, C.prefer),
				C.by(abstracted, C.defer),
				accessibility(),
				alpha ? keyIdentifierName() : C.nop,
			),
		),
	);
}

function functionSignature(
	node: MemberNode<
		AST_NODE_TYPES.TSPropertySignature | AST_NODE_TYPES.TSIndexSignature
	>,
): boolean {
	return (
		node.typeAnnotation?.typeAnnotation.type === AST_NODE_TYPES.TSFunctionType
	);
}

function node<K extends MemberType>(key: K) {
	return function (node: MemberNode): node is MemberNode<K> {
		return node.type === key;
	};
}
