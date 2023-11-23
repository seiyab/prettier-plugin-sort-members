import { type Printer } from "prettier";

module "prettier/plugins/estree" {
	export declare const printers: { estree: Printer };
}
