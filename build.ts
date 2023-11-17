await Bun.build({
	entrypoints: ["./index.ts"],
	outdir: "./dist",
	external: [
		"prettier",
		"@typescript-eslint/visitor-keys",
		"@typescript-eslint/types",
	],
});
