import { printers as estreePrinters } from "prettier/plugins/estree";
import { preprocess } from "./lib/preprocess";
import type { ParserOptions, SupportOption } from "prettier";

type AST = unknown;

const originalPreprocess: (x: AST, opts: ParserOptions<AST>) => AST =
	estreePrinters.estree.preprocess ?? ((x: AST) => x);

estreePrinters.estree.preprocess = (x, options) =>
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return
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
		description:
			"Do not sort members of classes that are subclass of this class.",
		default: [{ value: [] }],
	},
	keepGettersAndSettersTogether: {
		type: "boolean",
		category: "Global",
		default: false,
		description: "TBW",
	},
} satisfies Record<string, SupportOption>;
