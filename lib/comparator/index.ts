import bt from "@babel/types";
import { C, Comparator } from "./comparator";
import { keyIdentifierName } from "./key-identifier-name";
import { accessibility } from "./accessibility";
import { methodKind } from "./method-kind";
import { MemberNode, MemberTypes } from "../ast/member-like";
import { classMember } from "./class-member";
import { node } from "./kind/utils";
import { isField } from "./kind/field";
import { isInterfaceConstructor } from "./kind/constructor";
import { isMethod } from "./kind/method";

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
		// constructor signature for interface
		// constructor in class is handled as method
		C.capture(
			isInterfaceConstructor,
			C.by(($) => {
				if ($.type !== MemberTypes.TSConstructSignatureDeclaration) return 0;
				return (
					$.params?.length ??
					($ as unknown as bt.TSConstructSignatureDeclaration).parameters.length
				);
			}, C.number),
		),
		C.capture(isMethod, methodKind({ keepGettersAndSettersTogether })),

		classMember(),
		accessibility(),
		alpha ? keyIdentifierName() : C.nop,
	);
}
