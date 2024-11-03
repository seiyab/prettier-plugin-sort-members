import { describe, test, expect } from "bun:test";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { format } from "prettier";
import { ESLint } from "eslint";
import parser from "@typescript-eslint/parser";
import plugin from "@typescript-eslint/eslint-plugin";

const plugins = ["./index.ts"];

const dir = join(import.meta.dir, "..", "testdata");
const filenames = await readdir(dir);

describe("compatible with eslint-typescript", () => {
	describe("alpha", () => {
		const eslint = new ESLint({
			overrideConfig: {
				languageOptions: { parser },
				plugins: {
					"@typescript-eslint": plugin as unknown as ESLint.Plugin,
				},
				rules: {
					"@typescript-eslint/member-ordering": [
						"error",
						{ default: { order: "alphabetically" } },
					],
				},
			},
			overrideConfigFile: true,
		});

		test.each(filenames)("%s", async (name) => {
			const path = join(dir, name);
			const code = await readFile(path, "utf-8");
			const alpha = { sortMembersAlphabetically: true };
			const result = await format(code, {
				filepath: path,
				plugins,
				...alpha,
			});

			const lintResults = await eslint.lintText(result);

			expect(lintResults).toHaveLength(1);
			expect(lintResults[0].messages).toBeEmpty();
		});
	});
});
