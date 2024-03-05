## Changelog

---

### 0.1.0

#### Bug fix

- Sort literal keys alphabetically if `sortMembersAlphabetically` is true ([#34](https://github.com/seiyab/prettier-plugin-sort-members/issues/34))

#### Others

- Update dependencies

### 0.1.0

Nothing has changed since 0.1.0-rc.0

### 0.1.0-rc.0

#### Feature

- Support babel-ts parser

#### Bug fix

- Keep order for computed property if `sortMembersAlphabetically` is not true
- Method type precedes static-ness and decorated-ness

### 0.0.8-alpha.0

#### Breaking

- Add an option `sortMembersAlphabetically`
  - BREAKING: `sortMembersAlphabetically` is `false` by default. Earlier version works as it is set `true`
  - See README for detail

### 0.0.7-alpha.0

#### Feature

- JavaScript (babel) support

#### Bug

- Fix order of abstract field

#### Others

- Changed approach how to plug into Prettier
  - I believe it can't affect users. Report if this plugin get not to work.
