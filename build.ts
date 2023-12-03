await Bun.build({
	entrypoints: ["./index.ts"],
	outdir: "./dist",
	external: [
		"prettier",
		"@babel/types",
		"@typescript-eslint/visitor-keys",
		"@typescript-eslint/types",
	],
});
