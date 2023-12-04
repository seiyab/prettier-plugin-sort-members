import { visitorKeys as esVisitorKeys } from "@typescript-eslint/visitor-keys";
import { VISITOR_KEYS as babelVisitorKeys } from "@babel/types";
import { Node } from "./ast";

export function visit<T extends Node>(
	node: T,
	modifier: <S extends Node>(node: S) => S,
): T {
	if (node?.type == null) return node;
	if (node.type === "File")
		return {
			...cloneNode(node),
			program: visit(node.program, modifier),
		}; // babel
	const modified = cloneNode(modifier(node));
	const keys = new Set(
		(esVisitorKeys[modified.type] ?? []).concat(
			babelVisitorKeys[modified.type] ?? [],
		),
	) as Set<keyof T>;
	for (const key of keys) {
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
