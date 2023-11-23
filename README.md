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

```jsonc
{
	// ...
	"plugins": ["prettier-plugin-sort-members"]
}
```

Optionally, configure options.

```jsonc
{
	// ...
	"plugins": ["prettier-plugin-sort-members"],
	"sortMembersAlphabetically": true
}
```

## Overview

This plugin sorts members of your classes, interfaces, and type aliases.

```ts
// Before
class MyClass {
	d(): void {}
	e: null;
	c: string;
	a(): void {}
	b: number;
	constructor() {}
}

// After
class MyClass {
	e: null;
	c: string;
	b: number;
	constructor() {}
	d(): void {}
	a(): void {}
}

// After (with option sortMembersAlphabetically = true)
class MyClass {
	c: string;
	b: number;
	e: null;
	constructor() {}
	a(): void {}
	d(): void {}
}
```

The order respects default order of [`@typescript-eslint/member-ordering`](https://typescript-eslint.io/rules/member-ordering/#default-configuration)

## Options

### sortMembersAlphabetically

- type: `boolean`
- default: `false`

A boolean value to enable alphabetical ordering.
Other criteria such as visibility still precedes even if set `true`.
