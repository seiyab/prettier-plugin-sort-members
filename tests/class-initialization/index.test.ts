import { describe, expect, test } from "bun:test";
import { format } from "prettier";

describe.each(["babel", "babel-ts", "typescript"])("%s", (parser) => {
	async function expectFormat(input: string, expected: string, alpha = true) {
		const options = {
			parser,
			plugins: ["./index.ts"],
			sortMembersAlphabetically: alpha,
		};
		const result = await format(input, options);
		expect(result.trim()).toBe(expected.trim());
		expect(await format(result, options)).toBe(result);
	}

	test("sorts the static fields in each gap and moves methods and constructors", async () => {
		await expectFormat(
			`
class Registry {
  getSize() { return Registry.size; }
  static z = 0;
  static entries = new Map();
  constructor() {}
  static { Registry.entries.set("default", 1); }
  static size = Registry.entries.size;
  static a = 1;
  static { log(this.size); }
}
`,
			`
class Registry {
  static entries = new Map();
  static z = 0;
  static {
    Registry.entries.set("default", 1);
  }
  static a = 1;
  static size = Registry.entries.size;
  static {
    log(this.size);
  }
  constructor() {}
  getSize() {
    return Registry.size;
  }
}
`,
		);
	});

	test("preserves both directions of field dependencies in a named class expression", async () => {
		await expectFormat(
			`
const Example = class Named {
  static z = 1;
  static a = call(Named["z"]);
  #z = 1;
  b = this.#z;
  y = this.x;
  x = this.y;
  c = 0;
};
`,
			`
const Example = class Named {
  static z = 1;
  static a = call(Named["z"]);
  c = 0;
  y = this.x;
  x = this.y;
  #z = 1;
  b = this.#z;
};
`,
		);
	});

	test("counts updates and compound assignments as reads and skips plain writes and closures", async () => {
		await expectFormat(
			`
class Example {
  z = 1;
  c = this["z"]++;
  b = (this.z += 1);
  a = (this.z = 1);
  y = 1;
  d = ([this.y] = [1]);
  e = wrap(() => this.y);
}
`,
			`
class Example {
  a = (this.z = 1);
  d = ([this.y] = [1]);
  e = wrap(() => this.y);
  y = 1;
  z = 1;
  b = (this.z += 1);
  c = this["z"]++;
}
`,
		);
	});

	test("retains source order as the tie-breaker without alphabetical sorting", async () => {
		await expectFormat(
			`
class Example {
  z = 1;
  b = this.z;
  a = 2;
  static other = 0;
}
`,
			`
class Example {
  static other = 0;
  z = 1;
  b = this.z;
  a = 2;
}
`,
			false,
		);
	});
});

describe.each(["babel-ts", "typescript"])("%s", (parser) => {
	test("keeps a field before a public initializer that reads it", async () => {
		const options = { parser, plugins: ["./index.ts"] };
		const expected = `class Config {
  public unrelated = 0;
  private base = 10;
  public total = this.base + 5;
}
`;
		const result = await format(
			`class Config {
  private base = 10;
  public total = this.base + 5;
  public unrelated = 0;
}
`,
			options,
		);
		expect(result).toBe(expected);
		expect(await format(result, options)).toBe(result);
	});
});
