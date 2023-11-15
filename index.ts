import { parsers as typescriptParsers } from "prettier/parser-typescript";
import { printers as estreePrinters } from "prettier/plugins/estree";
import { preprocess as p } from "./lib/preprocess";

export const parsers = {
	typescript: typescriptParsers.typescript,
};

export const printers = {
	estree: {
		...estreePrinters.estree,
		preprocess: p,
	},
};

export const preprocess = p;
