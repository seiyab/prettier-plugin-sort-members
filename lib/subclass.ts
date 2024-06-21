import { AST_NODE_TYPES } from "@typescript-eslint/types";
import { Node } from "./ast";

export function isExcludedSubclass(node: Node, opts: unknown): boolean {
	const options: NonNullable<unknown> = opts ?? {};
	if (node.type !== AST_NODE_TYPES.ClassDeclaration) return false;
	if (node.superClass == null) return false;
	const spr = name(node.superClass);
	if (!("skipSortForSubclassOf" in options)) return false;
	if (!Array.isArray(options.skipSortForSubclassOf)) return false;
	return options.skipSortForSubclassOf.includes(spr);
}

function name(node: Node): string | null {
	switch (node.type) {
		case AST_NODE_TYPES.Identifier:
			return node.name;
		case AST_NODE_TYPES.MemberExpression: {
			const obj = name(node.object);
			if (obj == null) return null;
			if (node.property.type === AST_NODE_TYPES.Identifier) {
				return obj + "." + node.property.name;
			}
		}
	}
	return null;
}
