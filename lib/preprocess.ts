import { type AST } from "prettier";
import { visit } from "./visit";
import { interfaceComparator } from "./comparator/interface";

export function preprocess(ast: AST): AST {
	return visit(ast, {
		TSInterfaceBody(node) {
			return {
				...node,
				body: node.body.slice().sort(interfaceComparator),
			};
		},
	});
}
