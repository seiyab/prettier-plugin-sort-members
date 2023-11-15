import type { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/types";
import { VisitorKeys, visitorKeys } from "@typescript-eslint/visitor-keys";

type Modifier = Partial<{
	[K in AST_NODE_TYPES]?: <T extends TSESTree.Node & { type: K }>(node: T) => T;
}>;

export function visit<T extends TSESTree.Node>(node: T, modifier: Modifier): T {
	if (node?.type == null) return node;
	const modr: any = modifier[node.type];
	const modified = cloneNode(modr?.(node) ?? node);
	for (const key of visitorKeys[node.type] ?? []) {
		const child = modified[key];
		if (Array.isArray(child)) {
			modified[key] = child.map((c) => visit(c, modifier));
			continue;
		}
		modified[key] = visit(modified[key], modifier);
	}
	return modified;
}

function cloneNode<N extends TSESTree.Node>(node: N): N {
	return { ...node };
}
