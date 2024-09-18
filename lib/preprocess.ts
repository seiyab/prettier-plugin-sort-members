import { type AST } from "prettier";
import { stopModifying, visit } from "./visit";
import { Options, comparator } from "./comparator";
import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/types";
import { C } from "./comparator/comparator";
import { MemberLikeNodeTypesArray, MemberNode } from "./ast/member-like";
import { Node } from "./ast";
import { isExcludedSubclass } from "./subclass";
import { putGettersAndSettersTogether } from "./put-getters-and-setters-together";

export function preprocess(ast: AST, options: unknown): AST {
	const opt = options as Options;
	const memcomp = comparator(opt);
	const comp = C.capture(memberNodes, memcomp);
	return visit(ast, <T extends Node>(node: T): T | typeof stopModifying => {
		switch (node.type) {
			case AST_NODE_TYPES.TSInterfaceBody:
				return {
					...node,
					body: node.body.slice().sort(comp),
				} as TSESTree.TSInterfaceBody as T;
			case AST_NODE_TYPES.ClassBody: {
				const sorted = node.body.slice().sort(comp);
				const body = opt.keepGettersAndSettersTogether
					? putGettersAndSettersTogether(sorted)
					: sorted;
				return {
					...node,
					body,
				} as TSESTree.ClassBody as T;
			}
			case AST_NODE_TYPES.TSTypeLiteral:
				return {
					...node,
					members: node.members.slice().sort(comp),
				} as TSESTree.TSTypeLiteral as T;
			case AST_NODE_TYPES.ClassDeclaration:
				if (isExcludedSubclass(node, options)) return stopModifying;
				return node;
		}
		return node;
	});
}

function memberNodes(node: Node): node is MemberNode {
	return membersSet.has(node.type);
}

const membersSet = new Set<Node["type"]>(MemberLikeNodeTypesArray);
