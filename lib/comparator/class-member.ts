import { Node } from "../ast";
import { abstracted, decorated, hasStaticModifier } from "../ast/class-member";
import { C, Comparator } from "./comparator";

export function classMember(): Comparator<Node> {
	return C.by(($) => {
		if (decorated($)) return 2;
		if (hasStaticModifier($)) return 1;
		if (abstracted($)) return 4;
		return 3;
	}, C.number);
}
