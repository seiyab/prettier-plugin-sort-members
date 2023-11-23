import { printers as estreePrinters } from "prettier/plugins/estree";
import { preprocess } from "./lib/preprocess";
import { AST } from "prettier";

const originalPreprocess = estreePrinters.estree.preprocess ?? ((x: AST) => x);

estreePrinters.estree.preprocess = (x, options) =>
	preprocess(originalPreprocess(x, options), options);

export const options = {
	sortMembersAlphabetically: {
		type: "boolean",
		category: "Global",
		default: false,
		description:
			"Sort members alphabetically. Other criteria such as visibility precedes.",
	},
};
