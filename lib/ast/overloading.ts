import { TSESTree } from "@typescript-eslint/types";
import { MemberTypes } from "./member-like";
import { nameOf } from "./name-of";
import { Node } from ".";
import { hasStaticModifier } from "./class-member";
import { isClassMethod, isNode } from "@babel/types";

export function splitOverloads(members: Node[]): [Node[], Node[]] {
	const overloads: Node[] = [];
	const nonOverloads: Node[] = [];
	const implementedNames = new Set<string>(
		members
			.filter((m) => categoryOf(m) === "implementation")
			.map(nameOf)
			.filter((n) => n !== ""),
	);
	for (const member of members) {
		if (categoryOf(member) !== "definition") {
			nonOverloads.push(member);
			continue;
		}
		if (!implementedNames.has(nameOf(member))) {
			nonOverloads.push(member);
			continue;
		}
		overloads.push(member);
	}
	return [overloads, nonOverloads];
}

type ClassMemberCategory = "definition" | "implementation" | "others";

function categoryOf(member: Node): ClassMemberCategory {
	if (member.type === MemberTypes.TSDeclareMethod) return "definition";
	if (member.type === MemberTypes.MethodDefinition) {
		if (
			member.value.type ===
			TSESTree.AST_NODE_TYPES.TSEmptyBodyFunctionExpression
		)
			return "definition";
		return "implementation";
	}
	if (isNode(member) && isClassMethod(member)) {
		return "implementation";
	}
	return "others";
}

function groupOverloads(members: Node[]): Map<string, Node[]> {
	const map = new Map<string, Node[]>();
	for (const member of members) {
		const name = nameOf(member);
		let overloads = map.get(name);
		if (!overloads) {
			overloads = [];
			map.set(name, overloads);
		}
		overloads.push(member);
	}
	return map;
}

export function mergeOverloads(
	overloads: Node[],
	nonOverloads: Node[],
): Node[] {
	const staticOverloads = groupOverloads(overloads.filter(hasStaticModifier));
	const nonStaticOverloads = groupOverloads(
		overloads.filter((m) => !hasStaticModifier(m)),
	);
	const body: Node[] = [];
	for (const no of nonOverloads) {
		if (
			no.type !== MemberTypes.MethodDefinition &&
			!(isNode(no) && isClassMethod(no))
		) {
			body.push(no);
			continue;
		}
		const name = nameOf(no);
		if (!name) {
			body.push(no);
			continue;
		}
		const o = hasStaticModifier(no)
			? staticOverloads.get(name)
			: nonStaticOverloads.get(name);
		if (!o) {
			body.push(no);
			continue;
		}
		while (o.length) {
			body.push(o.shift()!);
		}
		body.push(no);
	}
	for (const s of staticOverloads.values()) {
		// shouldn't happen but conservatively handle it to avoid completely removing overloads
		while (s.length) {
			body.push(s.shift()!);
		}
	}
	for (const s of nonStaticOverloads.values()) {
		// shouldn't happen but conservatively handle it to avoid completely removing overloads
		while (s.length) {
			body.push(s.shift()!);
		}
	}
	return body;
}
