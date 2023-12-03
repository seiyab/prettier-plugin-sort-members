import { describe, test, expect } from "bun:test";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { format } from "prettier";

const plugins = ["./index.ts"];

const dir = join(import.meta.dir, "testdata");
const filenames = await readdir(dir);

describe("format", () => {
	const options = [
		{},
		{ sortMembersAlphabetically: true },
		{ sortMembersAlphabetically: false },
	];

	describe.each(options)("%j", (opts) => {
		test.each(filenames)("%s", async (name) => {
			const path = join(dir, name);
			const code = await readFile(path, "utf-8");
			const result = await format(code, {
				...opts,
				filepath: path,
				plugins,
			});
			expect(result).toMatchSnapshot();
		});

		describe("idempotency", () => {
			test.each(filenames)("%s", async (name) => {
				const path = join(dir, name);
				const code = await readFile(path, "utf-8");
				const result1 = await format(code, {
					...opts,
					filepath: path,
					plugins,
				});
				const result2 = await format(result1, {
					...opts,
					filepath: path,
					plugins,
				});
				expect(result2).toEqual(result1);
			});
		});

		describe("parser agnostic", () => {
			describe("TypeScript", () => {
				const parsers = ["typescript", "babel-ts"];
				describe.each(parsers)("%s", async (parser) => {
					test.each(filenames)("%s", async (name) => {
						const path = join(dir, name);
						const code = await readFile(path, "utf-8");
						const expected = await format(code, {
							...opts,
							filepath: path,
							plugins,
						});
						const actual = await format(code, {
							...opts,
							filepath: path,
							plugins,
							parser,
						});
						expect(actual).toBe(expected);
					});
				});
			});
		});
	});
});
