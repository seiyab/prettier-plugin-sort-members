import { Options, type AST } from "prettier";
import { visit } from "./visit";
import { comparator } from "./comparator";

export function preprocess(ast: AST, options: any): AST {
	const comp = comparator(options);
	return visit(ast, {
		TSInterfaceBody(node) {
			return {
				...node,
				body: node.body.slice().sort(comp),
			};
		},
		ClassBody(node) {
			return {
				...node,
				body: node.body.slice().sort(comp),
			};
		},
		TSTypeLiteral(node) {
			return {
				...node,
				members: node.members.slice().sort(comp),
			};
		},
	});
}
