# prettier-plugin-sort-members

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

## Contributing

## Reporting issues

You can submit an issue to report a bug, propose a feature or anything else. Feedback is welcome.
To report a security vulnerability, please use our [create an advisory form](https://github.com/seiyab/prettier-plugin-sort-members/security/advisories/new) on GitHub.

## Developing

prettier-plugin-sort-members is developed with [Bun](https://bun.sh/). Install Bun if you don't have it yet.

To get up and running, install dependencies and run tests:

```sh
bun install
bun test
```

Don't forget to add tests for your changes before you submit a PR.
