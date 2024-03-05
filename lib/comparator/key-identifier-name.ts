import { AST_NODE_TYPES } from "@typescript-eslint/types";
import { C, Comparator } from "./comparator";
import { Node } from "../ast";
import { isNode, isPrivateName, isStringLiteral } from "@babel/types";

export const keyIdentifierName = (): Comparator<Node> =>
	C.by(($) => {
		if ("key" in $) {
			switch ($.key.type) {
				case AST_NODE_TYPES.Identifier:
				case AST_NODE_TYPES.PrivateIdentifier:
					if ("computed" in $ && $.computed === true) return null;
					return $.key.name;
				case AST_NODE_TYPES.Literal: {
					const value = $.key.value;
					if (typeof value !== "string") return null;
					return value;
				}
			}
			if (isNode($.key)) {
				// babel nodes
				switch (true) {
					case isPrivateName($.key):
						if ($.key.id.type !== AST_NODE_TYPES.Identifier) return null;
						return $.key.id.name;
					case isStringLiteral($.key):
						return $.key.value;
				}
			}
		}
		return null;
	}, C.maybe(C.string));
