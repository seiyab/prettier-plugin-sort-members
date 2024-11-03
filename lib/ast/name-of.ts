import { AST_NODE_TYPES } from "@typescript-eslint/types";
import { isNode, isPrivateName, isStringLiteral } from "@babel/types";
import type { Node } from ".";
import { MemberTypes } from "./member-like";

export function nameOf(n: Node): string {
	if (n.type === MemberTypes.TSIndexSignature) {
		const p = n.parameters.at(0);
		if (p == undefined) return "";
		if (p.type !== AST_NODE_TYPES.Identifier) return "";
		return p.name;
	}
	if ("key" in n) {
		switch (n.key.type) {
			case AST_NODE_TYPES.Identifier:
			case AST_NODE_TYPES.PrivateIdentifier:
				return n.key.name;
			case AST_NODE_TYPES.Literal: {
				const value = n.key.value;
				if (typeof value !== "string") return "";
				return value;
			}
		}
		if (isNode(n.key)) {
			// babel nodes
			switch (true) {
				case isPrivateName(n.key):
					// eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
					if (n.key.id.type !== AST_NODE_TYPES.Identifier) return "";
					return n.key.id.name;
				case isStringLiteral(n.key):
					return n.key.value;
			}
		}
	}
	return "";
}
