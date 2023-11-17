import { printers as estreePrinters } from "prettier/plugins/estree";
import { preprocess as p } from "./lib/preprocess";

export const printers = {
	estree: {
		...estreePrinters.estree,
		preprocess: p,
	},
};
