import { Node } from "../ast";
import { C, Comparator } from "./comparator";
import { MemberTypes } from "../ast/member-like";

export function classMember(): Comparator<Node> {
	return C.by(($) => {
		if (decorated($)) return 2;
		if (hasStaticModifier($)) return 1;
		if (abstracted($)) return 4;
		return 3;
	}, C.number);
}

function decorated(node: Node): boolean {
	switch (node.type) {
		case MemberTypes.AccessorProperty:
		case MemberTypes.PropertyDefinition:
		case MemberTypes.MethodDefinition:
		case MemberTypes.ClassAccessorProperty:
		case MemberTypes.ClassProperty:
		case MemberTypes.ClassPrivateProperty:
		case MemberTypes.ClassMethod:
		case MemberTypes.ClassPrivateMethod:
			return (node.decorators?.length ?? 0) > 0;
	}
	return false;
}

function abstracted(node: Node): boolean {
	switch (node.type) {
		case MemberTypes.TSAbstractPropertyDefinition:
		case MemberTypes.TSAbstractMethodDefinition:
			return true;
		case MemberTypes.ClassProperty:
		case MemberTypes.TSDeclareMethod:
			return node.abstract === true;
	}
	return false;
}

function hasStaticModifier(node: Node): boolean {
	return "static" in node && node.static === true;
}
