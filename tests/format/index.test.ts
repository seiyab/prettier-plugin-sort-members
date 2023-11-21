import { describe, test, expect } from "bun:test";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { format } from "prettier";

const plugins = ["./index.ts"];

describe("format", async () => {
	const dir = join(import.meta.dir, "testdata");
	const filenames = await readdir(dir);

	test.each(filenames)("%s", async (name) => {
		const path = join(dir, name);
		const code = await readFile(path, "utf-8");
		const result = await format(code, {
			filepath: path,
			plugins,
		});
		expect(result).toMatchSnapshot();
	});

	describe("idempotency", () => {
		test.each(filenames)("%s", async (name) => {
			const path = join(dir, name);
			const code = await readFile(path, "utf-8");
			const result1 = await format(code, { filepath: path, plugins });
			const result2 = await format(result1, { filepath: path, plugins });
			expect(result2).toEqual(result1);
		});
	});
});
