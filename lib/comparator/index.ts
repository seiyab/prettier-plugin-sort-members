import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/types";
import { C } from "./comparator";
import { select } from "./select";
import { keyIdentifierName } from "./key-identifier-name";
import { BabelNodeTypes, Node, functionExpressions } from "../ast";
import { accessibility } from "./accessibility";
import { decorated } from "./decorated";
import { abstracted } from "./abstracted";
import { methodKind } from "./method-kind";

export const comparator = C.chain<Node>(
	// Signature
	C.capture(
		select.node(AST_NODE_TYPES.TSIndexSignature),
		C.by(functionSignature, C.defer),
	),

	// field
	C.capture(
		select
			.or(
				select.and(
					select.node(AST_NODE_TYPES.TSPropertySignature),
					select.not(functionSignature),
				),
			)
			.or(
				select.and(
					select
						.or(select.node(AST_NODE_TYPES.PropertyDefinition))
						.or(select.node(AST_NODE_TYPES.TSAbstractPropertyDefinition))
						.or(select.node(BabelNodeTypes.ClassProperty))
						.or(select.node(BabelNodeTypes.ClassPrivateProperty)),
					($) => !($.value && functionExpressions.includes($.value.type)),
				),
			),
		C.chain(
			C.property("static", C.prefer),
			C.by(decorated, C.prefer),
			accessibility(),
			C.by(abstracted, C.defer),
			C.property("computed", C.defer),
			keyIdentifierName(),
		),
	),

	// constructor signature for interface
	// constructor in class is handled as method
	C.capture(
		select
			.or(select.node(AST_NODE_TYPES.TSConstructSignatureDeclaration))
			.or(
				select.and(
					select.node(AST_NODE_TYPES.MethodDefinition),
					($) =>
						$.key.type === AST_NODE_TYPES.Identifier &&
						$.key.name === "constructor",
				),
			),
		C.by(($) => {
			if ($.type !== AST_NODE_TYPES.TSConstructSignatureDeclaration) return 0;
			return $.params.length;
		}, C.number),
	),

	// method
	C.capture(
		select
			.or(select.node(AST_NODE_TYPES.TSMethodSignature))
			.or(select.node(AST_NODE_TYPES.MethodDefinition))
			.or(select.node(AST_NODE_TYPES.TSAbstractMethodDefinition))
			.or(select.node(BabelNodeTypes.ClassMethod))
			.or(select.node(BabelNodeTypes.ClassPrivateMethod))
			.or(
				select.and(
					select.node(
						AST_NODE_TYPES.PropertyDefinition,
						BabelNodeTypes.ClassProperty,
						BabelNodeTypes.ClassPrivateProperty,
					),
					($) => $.value != null && functionExpressions.includes($.value.type),
				),
			)
			.or(
				select.and(
					select.node(AST_NODE_TYPES.TSPropertySignature),
					functionSignature,
				),
			),
		C.chain(
			C.property("static", C.prefer),
			C.by(decorated, C.prefer),
			methodKind(),
			C.by(abstracted, C.defer),
			accessibility(),
			C.property("computed", C.defer),
			keyIdentifierName(),
		),
	),
);

function functionSignature(
	node: TSESTree.TSPropertySignature | TSESTree.TSIndexSignature,
): boolean {
	return (
		node.typeAnnotation?.typeAnnotation.type === AST_NODE_TYPES.TSFunctionType
	);
}
