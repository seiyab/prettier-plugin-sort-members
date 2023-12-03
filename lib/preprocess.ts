import { type AST } from "prettier";
import { visit } from "./visit";
import { Options, comparator } from "./comparator";
import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/types";
import { C } from "./comparator/comparator";
import { MemberLikeNodeTypesArray, MemberNode } from "./ast/member-like";
import { Node } from "./ast";

export function preprocess(ast: AST, options: unknown): AST {
	const memcomp = comparator(options as Options);
	const comp = C.capture(memberNodes, memcomp);
	return visit(ast, <T extends Node>(node: T): T => {
		switch (node.type) {
			case AST_NODE_TYPES.TSInterfaceBody:
				return {
					...node,
					body: node.body.slice().sort(comp),
				} as TSESTree.TSInterfaceBody as T;
			case AST_NODE_TYPES.ClassBody:
				return {
					...node,
					body: node.body.slice().sort(comp),
				} as TSESTree.ClassBody as T;
			case AST_NODE_TYPES.TSTypeLiteral:
				return {
					...node,
					members: node.members.slice().sort(comp),
				} as TSESTree.TSTypeLiteral as T;
		}
		return node;
	});
}

function memberNodes(node: Node): node is MemberNode {
	return membersSet.has(node.type);
}

const membersSet = new Set<Node["type"]>(MemberLikeNodeTypesArray);
