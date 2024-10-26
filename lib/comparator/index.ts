import { C, Comparator } from "./comparator";
import { keyIdentifierName } from "./key-identifier-name";
import { accessibility } from "./accessibility";
import { methodKind } from "./method-kind";
import { MemberNode, MemberType, MemberTypes } from "../ast/member-like";
import { classMember } from "./class-member";
import { isField } from "./kind/field";
import { isConstructor } from "./kind/constructor";
import { isMethod } from "./kind/method";
import { isAccessor } from "./kind/accessor";
import { constructorParams } from "./constructor-params";

export type Options = {
	sortMembersAlphabetically?: boolean;
	keepGettersAndSettersTogether?: boolean;
};

export function comparator(options: Partial<Options>): Comparator<MemberNode> {
	const alpha = options.sortMembersAlphabetically === true;
	const keepGettersAndSettersTogether =
		options.keepGettersAndSettersTogether ?? false;
	return C.chain<MemberNode>(
		C.capture(node(MemberTypes.TSIndexSignature)),
		C.capture(isField),
		C.capture(isConstructor, constructorParams()),
		C.capture(isAccessor),
		C.capture(isMethod, methodKind({ keepGettersAndSettersTogether })),

		classMember(),
		accessibility(),
		alpha ? keyIdentifierName() : C.nop,
	);
}

export function node<K extends MemberType>(key: K) {
	return function (node: MemberNode): node is MemberNode<K> {
		return node.type === key;
	};
}
