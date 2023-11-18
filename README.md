# prettier-plugin-sort-members

## Project status

prettier-plugin-sort-members is still in alpha version.
Feedback is welcome.

## Usage

```bash
npm install prettier-plugin-sort-members --save-dev
# or
yarn add prettier-plugin-sort-members --dev
# or
bun add prettier-plugin-sort-members --dev
```

Edit your prettierrc.

```json
{
	// ...
	"plugins": ["prettier-plugin-sort-members"]
}
```

## Overview

This plugin sorts members of your classes, interfaces, and type aliases.

```ts
// Before
class MyClass {
	c: string;
	a(): void {}
	b: number;
	constructor() {}
}

// After
class MyClass {
	b: number;
	c: string;
	constructor() {}
	a(): void {}
}
```

The order respects default order of [`@typescript-eslint/member-ordering`](https://typescript-eslint.io/rules/member-ordering/#default-configuration)
