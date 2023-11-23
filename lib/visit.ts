import { visitorKeys } from "@typescript-eslint/visitor-keys";
import { Node, NodeTypes } from "./ast";

type Modifier = Partial<{
	[K in NodeTypes]?: <T extends Node<K>>(node: T) => T;
}>;

export function visit<T extends Node>(node: T, modifier: Modifier): T {
	if (node?.type == null) return node;
	if (node.type === "File")
		return { ...cloneNode(node), program: visit(node.program, modifier) }; // babel
	const modr = modifier[node.type] as ((n: T) => T) | undefined;
	const modified = cloneNode(modr?.(node) ?? node);
	for (const key of visitorKeys[node.type] ?? []) {
		const k = key as keyof T;
		const child = modified[k];
		if (Array.isArray(child)) {
			modified[k] = child.map((c) => visit(c, modifier)) as T[typeof k];
			continue;
		}
		modified[k] = visit(modified[k] as Node, modifier) as T[typeof k];
	}
	return modified;
}

function cloneNode<N extends Node>(node: N): N {
	return { ...node };
}
