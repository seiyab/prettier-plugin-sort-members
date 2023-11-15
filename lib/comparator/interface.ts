import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/types";
import { C, nodeComparator } from "./comparator";

export const interfaceComparator = nodeComparator<TSESTree.TypeElement>()
	.type(
		AST_NODE_TYPES.TSPropertySignature,
		C.chain(
			C.property("computed", C.boolean),
			C.property(
				"key",
				nodeComparator<TSESTree.PropertyName>()
					.type(AST_NODE_TYPES.Identifier, C.property("name", C.string))
					.build(),
			),
		),
	)
	.type(
		AST_NODE_TYPES.TSMethodSignature,
		C.chain(
			C.property("computed", C.boolean),
			C.property(
				"key",
				nodeComparator<TSESTree.PropertyName>()
					.type(AST_NODE_TYPES.Identifier, C.property("name", C.string))
					.build(),
			),
		),
	)
	.build();
