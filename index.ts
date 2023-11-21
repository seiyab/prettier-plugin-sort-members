import { printers as estreePrinters } from "prettier/plugins/estree";
import { preprocess as p } from "./lib/preprocess";
import { AST } from "prettier";

const originalPreprocess = estreePrinters.estree.preprocess ?? ((x: AST) => x);

estreePrinters.estree.preprocess = (x, options) =>
	p(originalPreprocess(x, options));
