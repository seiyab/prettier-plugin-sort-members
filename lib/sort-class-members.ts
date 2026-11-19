import { AST_NODE_TYPES as Types } from "@typescript-eslint/types";
import { Node } from "./ast";
import { abstracted } from "./ast/class-member";
import { MemberNode } from "./ast/member-like";
import { C, Comparator } from "./comparator/comparator";
import { isField } from "./comparator/kind/field";
import { childKeys } from "./visit";

export function sortClassMembers(
	members: Node[],
	className: string | undefined,
	compare: Comparator<Node>,
	isMember: (node: Node) => node is MemberNode,
): Node[] {
	const entries = members.map((node, index) => ({
		node,
		index,
		incoming: 0,
		outgoing: new Set<number>(),
	}));
	const fields = new Map<string, number | null>();
	const initializers: { value: Node; isStatic: boolean; index: number }[] = [];
	let previousBlock: number | undefined;
	let staticFields: number[] = [];

	function constrain(first: number, second: number) {
		if (first === second) return;
		const earlier = entries[Math.min(first, second)];
		const later = entries[Math.max(first, second)];
		if (earlier.outgoing.has(later.index)) return;
		earlier.outgoing.add(later.index);
		later.incoming++;
	}

	for (const { node, index } of entries) {
		if (node.type === Types.StaticBlock) {
			if (previousBlock !== undefined) constrain(previousBlock, index);
			for (const field of staticFields) constrain(field, index);
			previousBlock = index;
			staticFields = [];
			continue;
		}
		if (!isRuntimeField(node)) continue;
		const isStatic = node.static === true;
		if (isStatic) {
			if (previousBlock !== undefined) constrain(previousBlock, index);
			staticFields.push(index);
		}
		const key = propertyKey(
			node.key,
			"computed" in node && node.computed === true,
		);
		if (key !== undefined) {
			const field = fieldKey(isStatic, key);
			fields.set(field, fields.has(field) ? null : index);
		}
		if (node.value) initializers.push({ value: node.value, isStatic, index });
	}

	for (const { value, isStatic, index } of initializers) {
		forEachRead(value, (read) => {
			const receiver = read.object;
			if (
				receiver.type !== Types.ThisExpression &&
				!(
					isStatic &&
					receiver.type === Types.Identifier &&
					receiver.name === className
				)
			)
				return;
			const key = propertyKey(read.property, read.computed);
			if (key === undefined) return;
			const field = fields.get(fieldKey(isStatic, key));
			if (field != null) constrain(field, index);
		});
	}

	function rank(node: Node): number {
		if (node.type === Types.StaticBlock) return 1;
		if (!isMember(node)) return 3;
		if (node.type === Types.TSIndexSignature || isField(node)) return 0;
		return 2;
	}

	const preferredOrder = C.chain(C.by(rank, C.number), compare);
	const pending = entries
		.slice()
		.sort(C.by((entry) => entry.node, preferredOrder));
	if (pending.every((entry) => entry.incoming === 0))
		return pending.map(({ node }) => node);

	// Every edge points forward in the input, so there is always a ready entry.
	const result: Node[] = [];
	while (pending.length) {
		const ready = pending.findIndex(({ incoming }) => incoming === 0);
		const [entry] = pending.splice(ready, 1);
		result.push(entry.node);
		for (const next of entry.outgoing) entries[next].incoming--;
	}
	return result;
}

function isRuntimeField(
	node: Node,
): node is MemberNode<
	| Types.PropertyDefinition
	| Types.AccessorProperty
	| "ClassProperty"
	| "ClassPrivateProperty"
	| "ClassAccessorProperty"
> {
	switch (node.type) {
		case Types.PropertyDefinition:
		case Types.AccessorProperty:
		case "ClassProperty":
		case "ClassPrivateProperty":
		case "ClassAccessorProperty":
			return !abstracted(node) && !("declare" in node && node.declare);
		default:
			return false;
	}
}

function fieldKey(isStatic: boolean, key: string): string {
	return (isStatic ? "static:" : "instance:") + key;
}

function propertyKey(node: Node, computed: boolean): string | undefined {
	switch (node.type) {
		case Types.Identifier:
			return computed ? undefined : "public:" + node.name;
		case Types.PrivateIdentifier:
			return "private:" + node.name;
		case "PrivateName":
			return "private:" + node.id.name;
		case Types.Literal:
			if (typeof node.value === "string" || typeof node.value === "number")
				return "public:" + node.value;
			return;
		case "StringLiteral":
		case "NumericLiteral":
			return "public:" + node.value;
	}
}

function forEachRead(
	node: Node | null | undefined,
	onRead: (read: { object: Node; property: Node; computed: boolean }) => void,
	writeTarget = false,
): void {
	if (node == null) return;
	switch (node.type) {
		case Types.ArrowFunctionExpression:
		case Types.FunctionExpression:
		case Types.ClassExpression:
			return;
		case "ObjectMethod":
			if (node.computed) forEachRead(node.key, onRead);
			return;
		case Types.MemberExpression:
		case "OptionalMemberExpression":
			if (!writeTarget) onRead(node);
			break;
	}

	for (const key of childKeys(node)) {
		const child: unknown = node[key];
		const childIsWriteTarget = isWriteTarget(node, key, writeTarget);
		if (Array.isArray(child)) {
			for (const item of child as Node[])
				forEachRead(item, onRead, childIsWriteTarget);
		} else {
			forEachRead(child as Node | null | undefined, onRead, childIsWriteTarget);
		}
	}
}

function isWriteTarget(
	node: Node,
	key: string,
	parentIsTarget: boolean,
): boolean {
	if (node.type === Types.AssignmentExpression)
		return key === "left" && node.operator === "=";
	if (!parentIsTarget) return false;
	switch (node.type) {
		case Types.ArrayPattern:
			return key === "elements";
		case Types.ObjectPattern:
			return key === "properties";
		case Types.Property:
		case "ObjectProperty":
			return key === "value";
		case Types.AssignmentPattern:
			return key === "left";
		case Types.RestElement:
			return key === "argument";
		case Types.TSAsExpression:
		case Types.TSNonNullExpression:
		case Types.TSSatisfiesExpression:
		case Types.TSTypeAssertion:
		case "ParenthesizedExpression":
			return key === "expression";
		default:
			return false;
	}
}
