export function languageOptions(dir) {
	return {
		parserOptions: {
			projectService: true,
			tsConfigDirName: dir,
		},
	};
}
