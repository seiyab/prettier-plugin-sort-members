// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import { languageOptions } from "./config/eslint/language-options.mjs";

export default tseslint.config(
	eslint.configs.recommended,
	...tseslint.configs.recommendedTypeChecked,
	// @ts-expect-error fixme: resolve dirname
	{ languageOptions: languageOptions(import.meta.dirname) },
	{ ignores: ["tests/**/testdata/", "dist/"] },
	{ files: ["**/*.mjs"], ...tseslint.configs.disableTypeChecked },
);
