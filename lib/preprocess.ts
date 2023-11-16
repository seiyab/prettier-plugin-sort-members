import { type AST } from "prettier";
import { visit } from "./visit";
import { comparator } from "./comparator";

export function preprocess(ast: AST): AST {
	return visit(ast, {
		TSInterfaceBody(node) {
			return {
				...node,
				body: node.body.slice().sort(comparator),
			};
		},
		ClassBody(node) {
			return {
				...node,
				body: node.body.slice().sort(comparator),
			};
		},
	});
}
