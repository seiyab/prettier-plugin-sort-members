import { C, Comparator } from "./comparator";
import { MemberNode, MemberTypes } from "../ast/member-like";

export function methodKind<T extends MemberNode>(opt: {
	keepGettersAndSettersTogether: boolean;
}): Comparator<T> {
	return C.by(($) => {
		switch ($.type) {
			case MemberTypes.TSMethodSignature:
			case MemberTypes.MethodDefinition:
			case MemberTypes.TSAbstractMethodDefinition:
			case MemberTypes.ClassMethod:
			case MemberTypes.ClassPrivateMethod:
			case MemberTypes.TSDeclareMethod:
				switch ($.kind) {
					case "constructor":
						return 0;
					case "get":
						return 1;
					case "set":
						return opt.keepGettersAndSettersTogether ? 1 : 2;
					case "method":
						return 3;
				}
		}
		return 3;
	}, C.number);
}
