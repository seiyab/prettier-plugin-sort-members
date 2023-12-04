import { Node } from "../ast";
import { C, Comparator } from "./comparator";

export function classMember(): Comparator<Node> {
	return C.by(($) => {
		if ("static" in $) return $.static === true;
		return false;
	}, C.prefer);
}
