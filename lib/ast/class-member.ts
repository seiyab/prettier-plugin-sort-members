import { MemberTypes } from "./member-like";
import { Node } from ".";

export function decorated(node: Node): boolean {
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

export function abstracted(node: Node): boolean {
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

export function hasStaticModifier(node: Node): boolean {
	return "static" in node && node.static === true;
}
