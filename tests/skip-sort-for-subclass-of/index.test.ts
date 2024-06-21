import { describe, test, expect } from "bun:test";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { format } from "prettier";

const plugins = ["./index.ts"];

const dir = join(import.meta.dir, "testdata");
const files = await readdir(dir);

describe("react/sort-comp", () => {
	const supers = [[[]], [["React.Component"]], [["Component"]], [["Promise"]]];
	describe.each(supers)("%j", async (sp) => {
		test.each(files.filter((f) => f.startsWith("react")))(
			"%s",
			async (name) => {
				const opts = {
					skipSortForSubclassOf: sp,
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
			},
		);

		test.each(files)("parser agnostic: %s", async (name) => {
			const path = join(dir, name);
			const opts = {
				skipSortForSubclassOf: sp,
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
});
