import { visitorKeys } from "@typescript-eslint/visitor-keys";
import { Node, NodeTypes } from "./ast";

type Modifier = Partial<{
	[K in NodeTypes]?: <T extends Node<K>>(node: T) => T;
}>;

export function visit<T extends Node>(node: T, modifier: Modifier): T {
	if (node?.type == null) return node;
	if (node.type === "File")
		return { ...cloneNode(node), program: visit(node.program, modifier) }; // babel
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

function cloneNode<N extends Node>(node: N): N {
	return { ...node };
}
