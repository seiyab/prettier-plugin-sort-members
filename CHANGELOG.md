## Changelog

---

### 0.2.4

#### Chore

- Update dependencies ([#75](https://github.com/seiyab/prettier-plugin-sort-members/pull/75))

### 0.2.3

#### Bug fix

- Handle TypeScript decorated method overloading ([#72](https://github.com/seiyab/prettier-plugin-sort-members/pull/72))

### 0.2.2

#### Feature

- Support TypeScript accessor ([#62](https://github.com/seiyab/prettier-plugin-sort-members/pull/62)).

#### Bug fix

- Improve `sortMembersAlphabetically` in compatibility with `@typescript-eslint/member-ordering`'s `{ order: "alphabetically" }` ([#67](https://github.com/seiyab/prettier-plugin-sort-members/pull/67))

### 0.2.1

No changes from 0.2.1-rc.1

### 0.2.1-rc.1

#### Bug fix

- Improve compatibility with `@typescript-eslint/member-ordering` ([#57](https://github.com/seiyab/prettier-plugin-sort-members/issues/57)).
  - Note that `@typescript-eslint/member-ordering` is inconsistent a bit. For static methods, decorated ones go latter. On the other hand, for instance methods, decorated ones go former. From this version, `prettier-plugin-sort-members` also goes same way.

### 0.2.1-rc.0

#### Feature

- `keepGettersAndSettersTogether` will couple setter with associated getter.

#### Others

- Internal package updates and cleanup

### 0.2.0

#### Feature

- Add new option `keepGettersAndSettersTogether`

### 0.2.0-rc.0

#### Feature

- Add new option `skipSortForSubclassOf`

### 0.1.2

#### Bug fix

- For type alias and interface, consider function members as members, not method ([#40](https://github.com/seiyab/prettier-plugin-sort-members/issues/40)). This improves compatibility with [`@typescript-eslint/member-ordering`](https://typescript-eslint.io/rules/member-ordering/#default-configuration)'s default setting.
  - Feel free to request an option if you feel former ordering is more consistent or come up with better rule.

### 0.1.1

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
