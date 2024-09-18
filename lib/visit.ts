import { visitorKeys as esVisitorKeys } from "@typescript-eslint/visitor-keys";
import { VISITOR_KEYS as babelVisitorKeys } from "@babel/types";
import { Node } from "./ast";

export const stopModifying = Symbol("stopModifying");

export function visit<T extends Node>(
	node: T,
	modifier: <T extends Node>(node: T) => T | typeof stopModifying,
): T {
	if (node?.type == null) return node;
	if (node.type === "File")
		return {
			...cloneNode(node),
			program: visit(node.program, modifier),
		}; // babel

	const modified = modifier(node);
	if (modified === stopModifying) return node;
	const updatedNode = cloneNode(modified);
	const keys = new Set(
		(esVisitorKeys[updatedNode.type] ?? []).concat(
			babelVisitorKeys[updatedNode.type] ?? [],
		),
	) as Set<keyof T>;
	for (const key of keys) {
		const k = key satisfies keyof T;
		const child = updatedNode[k];
		if (Array.isArray(child)) {
			updatedNode[k] = (child).map((c: Node) => visit(c, modifier)) as T[typeof k];
			continue;
		}
		updatedNode[k] = visit(updatedNode[k] as Node, modifier) as T[typeof k];
	}
	return updatedNode;
}

function cloneNode<N extends Node>(node: N): N {
	return { ...node };
}
