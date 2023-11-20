import { printers as estreePrinters } from "prettier/plugins/estree";
import { preprocess as p } from "./lib/preprocess";
import { parsers as ts } from "prettier/plugins/typescript";
import { parsers as babel } from "prettier/plugins/babel";

export const parsers = {
	...babel,
	...ts,
};

export const printers = {
	estree: {
		...estreePrinters.estree,
		preprocess: p,
	},
};
