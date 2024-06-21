import { printers as estreePrinters } from "prettier/plugins/estree";
import { preprocess } from "./lib/preprocess";
import type { AST, SupportOption } from "prettier";

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
	skipSortForSubclassOf: {
		type: "string",
		array: true,
		category: "Global",
		description: "Do not sort members of classes that are subclass of this class.",
		default: [{value: []}],
	},
} satisfies Record<string, SupportOption>;
