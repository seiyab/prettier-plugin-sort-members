import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/types";
import { C } from "./comparator";
import { select } from "./select";
import { keyIdentifierName } from "./keyIdentifierName";
import { functionExpressions } from "../ast";
import { accessibility } from "./accessibility";
import { decoration } from "./decoration";

export const comparator = C.chain<TSESTree.Node>(
	// Signature
	C.when(select.node(AST_NODE_TYPES.TSIndexSignature), C.nop),

	// field
	C.when(
		select.or(
			select.node(AST_NODE_TYPES.TSPropertySignature),
			select.and(
				select.node(AST_NODE_TYPES.PropertyDefinition),
				($) => !($.value && functionExpressions.includes($.value.type)),
			),
		),
		C.chain(
			C.property("static", C.reverse(C.boolean)),
			decoration(),
			accessibility(),
			C.property("computed", C.boolean),
			keyIdentifierName(),
		),
	),

	// constructor
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
			select.and(
				select.node(AST_NODE_TYPES.PropertyDefinition),
				($) => $.value != null && functionExpressions.includes($.value.type),
			),
		),
		C.chain(
			C.property("static", C.reverse(C.boolean)),
			decoration(),
			accessibility(),
			C.property("computed", C.boolean),
			keyIdentifierName(),
		),
	),
);
