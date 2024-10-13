import { Node } from "../ast";
import { abstracted } from "./abstracted";
import { C, Comparator } from "./comparator";
import { decorated } from "./decorated";

export function classMember(): Comparator<Node> {
	return C.by(($) => {
		if (decorated($)) return 2;
		if ("static" in $ && $.static === true) return 1;
		if (abstracted($)) return 4;
		return 3;
	}, C.number);
}
