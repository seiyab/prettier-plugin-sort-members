import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/types";
import { C } from "./comparator";
import { select } from "./select";
import { keyIdentifierName } from "./keyIdentifierName";
import { functionExpressions } from "../ast";
import { accessibility } from "./accessibility";
import { decoration } from "./decoration";
import { abstracts } from "./abstracts";
import { methodKind } from "./method-kind";

export const comparator = C.chain<TSESTree.Node>(
	// Signature
	C.when(select.node(AST_NODE_TYPES.TSIndexSignature), C.nop),

	// field
	C.when(
		select.or(
			select.node(AST_NODE_TYPES.TSPropertySignature),
			select.and(
				select.node(
					AST_NODE_TYPES.PropertyDefinition,
					AST_NODE_TYPES.TSAbstractPropertyDefinition,
				),
				($) => !($.value && functionExpressions.includes($.value.type)),
			),
		),
		C.chain(
			C.property("static", C.reverse(C.boolean)),
			decoration(),
			accessibility(),
			abstracts(),
			C.property("computed", C.boolean),
			keyIdentifierName(),
		),
	),

	// constructor signature for interface
	// constructor in class is handled as method
	C.when(
		select.or(
			select.node(AST_NODE_TYPES.TSConstructSignatureDeclaration),
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
	C.when(
		select.or(
			select.node(AST_NODE_TYPES.TSMethodSignature),
			select.node(AST_NODE_TYPES.MethodDefinition),
			select.node(AST_NODE_TYPES.TSAbstractMethodDefinition),
			select.and(
				select.node(AST_NODE_TYPES.PropertyDefinition),
				($) => $.value != null && functionExpressions.includes($.value.type),
			),
		),
		C.chain(
			C.property("static", C.reverse(C.boolean)),
			decoration(),
			methodKind(),
			abstracts(),
			accessibility(),
			C.property("computed", C.boolean),
			keyIdentifierName(),
		),
	),
);
