import { describe, test, expect } from "bun:test";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { format } from "prettier";
import { ESLint } from "eslint";

const plugins = ["./index.ts"];

const dir = join(import.meta.dir, "testdata");
const files = await readdir(dir);

describe("@typescript-eslint/keep-getters-and-setters-together", () => {
	describe.each([true, false])("%j", async (opt) => {
		test.each(files)("%s", async (name) => {
			const opts = {
				keepGettersAndSettersTogether: opt,
				sortMembersAlphabetically: true,
			};
			const path = join(dir, name);
			const code = await readFile(path, "utf-8");
			const result = await format(code, {
				...opts,
				filepath: path,
				plugins,
			});
			expect(result).toMatchSnapshot();
		});

		test.each(files)("parser agnostic: %s", async (name) => {
			const path = join(dir, name);
			const opts = {
				keepGettersAndSettersTogether: opt,
				sortMembersAlphabetically: true,
				filepath: path,
				plugins,
			};
			const code = await readFile(path, "utf-8");
			const result1 = await format(code, {
				...opts,
				parser: "typescript",
			});
			const result2 = await format(code, {
				...opts,
				parser: "babel-ts",
			});
			expect(result1).toBe(result2);
		});
	});

	test.each(files)("no conflict: %s", async (name) => {
		const eslint = new ESLint({
			overrideConfig: {
				parser: "@typescript-eslint/parser",
				plugins: ["@typescript-eslint"],
				extends: [],
				rules: {
					"@typescript-eslint/adjacent-overload-signatures": "error",
				},
			},
			useEslintrc: false,
		});
		const opts = {
			keepGettersAndSettersTogether: true,
			sortMembersAlphabetically: true,
		};
		const path = join(dir, name);
		const code = await readFile(path, "utf-8");
		const result = await format(code, {
			...opts,
			filepath: path,
			plugins,
		});

		const lintResults = await eslint.lintText(result);

		expect(lintResults).toHaveLength(1);
		expect(lintResults[0].messages).toBeEmpty();
	});
});
