import { Node } from "./ast";
import { MemberNode, MemberTypes } from "./ast/member-like";
import { nameOf } from "./ast/name-of";

export function putGettersAndSettersTogether(members: Node[]): Node[] {
	const getterNames = new Set<string>(
		members.flatMap((m) => {
			const name = nameOf(m);
			if (!("kind" in m) || m.kind !== "get" || name === null) return [];
			return [name];
		}),
	);
	const setters = new Map<string, Node>(
		members.flatMap((m) => {
			const name = nameOf(m);
			if (!("kind" in m) || m.kind !== "set" || name === null) return [];
			return [[name, m]];
		}),
	);

	return members.flatMap((m) => {
		const name = nameOf(m);
		if (!("kind" in m) || name === null) return [m];

		switch (m.kind) {
			case "get": {
				const danglingSetter = setters.get(name);
				if (danglingSetter !== undefined) return [m, danglingSetter];
				return [m];
			}
			case "set": {
				if (getterNames.has(name)) return [];
				return [m];
			}
		}
		return [m];
	});
}
