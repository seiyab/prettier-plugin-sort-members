import { type Printer } from "prettier";

module "prettier/plugins/estree" {
	declare const printers: { estree: Printer };
}
