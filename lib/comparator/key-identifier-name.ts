import { C, Comparator } from "./comparator";
import { Node } from "../ast";
import { nameOf } from "../ast/name-of";

export const keyIdentifierName = (): Comparator<Node> =>
	C.by(nameOf, C.maybe(C.string));
