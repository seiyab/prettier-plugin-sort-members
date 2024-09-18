import { AST_NODE_TYPES } from "@typescript-eslint/types";
import { isNode, isPrivateName, isStringLiteral } from "@babel/types";
import type { Node } from ".";

export function nameOf(n: Node): string | null {
	if ("key" in n) {
		switch (n.key.type) {
			case AST_NODE_TYPES.Identifier:
			case AST_NODE_TYPES.PrivateIdentifier:
				if ("computed" in n && n.computed === true) return null;
				return n.key.name;
			case AST_NODE_TYPES.Literal: {
				const value = n.key.value;
				if (typeof value !== "string") return null;
				return value;
			}
		}
		if (isNode(n.key)) {
			// babel nodes
			switch (true) {
				case isPrivateName(n.key):
					// eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
					if (n.key.id.type !== AST_NODE_TYPES.Identifier) return null;
					return n.key.id.name;
				case isStringLiteral(n.key):
					return n.key.value;
			}
		}
	}
	return null;
}
