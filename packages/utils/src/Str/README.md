# @toolbox-ts/utils Str

The `Str` module provides **safe, type-aware string utilities** for common operations:

* Case conversions (`camel ↔ kebab`)
* String cleaning (`arrays, CSV, lines`)
* Type guards (`alphabetic`, `camel`, `kebab`, `prefix`, `suffix`)
* Prefix/suffix helpers
* Parsing helpers (`csv`, `lines`, `spaceSeparated`)

It also exports **string type utilities** for compile-time guarantees.

---

## API

### Case Conversion

#### `camelToKebab(str)`

Converts `camelCase` → `kebab-case`.

* Ensures first letter is lowercase.
* Splits uppercase letters with `-`.
* Returns lowercase string.

```ts
camelToKebab('noEdit')    // 'no-edit'
camelToKebab('aAAAAA')    // 'a-a-a-a-a-a'
```

---

#### `kebabToCamel(str)`

Converts `kebab-case` → `camelCase`.

* Keeps first segment lowercase.
* Capitalizes subsequent segments.

```ts
kebabToCamel('no-edit')   // 'noEdit'
kebabToCamel('multi-word-key') // 'multiWordKey'
```

---

#### `capitalize(str)` / `uncapitalize(str)`

Capitalizes or uncapitalizes first letter.

```ts
capitalize('foo') // 'Foo'
uncapitalize('Foo') // 'foo'
```

---

### Cleaning

#### `cleanArr(arr, dedupe = false)`

Cleans an array of strings:

* Trims each string.
* Removes empty or non-string values.
* Optionally deduplicates.

```ts
cleanArr([' foo ', '', 123, 'bar', 'bar'], true)
// ['foo', 'bar']
```

---

### Type Guards (`is`)

* **`is.alphabetic(str)`** → only letters.
* **`is.camel(str, type?)`** → matches camelCase regex variant.
* **`is.kebab(str, type?)`** → matches kebab-case regex variant.
* **`is.prefixed(str, prefix)`** → has given prefix.
* **`is.suffixed(str, suffix)`** → has given suffix.
* **`is.str(val)`** → is string.
* **`is.array(val)`** → is array of strings.

```ts
is.camel('camelCase') // true
is.kebab('kebab-case') // true
is.prefixed('test.js', 'test.') // true
is.suffixed('file.ts', '.ts') // true
```

---

### Prefix/Suffix

#### `prefix(pre, str)`

Adds a prefix.

```ts
prefix('pre-', 'fix') // 'pre-fix'
```

#### `suffix(str, suf)`

Adds a suffix.

```ts
suffix('file', '.ts') // 'file.ts'
```

---

### Parsing (`parse`)

#### `parse.csvRow(input)`

Splits CSV row → string array.

```ts
parse.csvRow(' foo, bar , ,baz ') // ['foo', 'bar', 'baz']
```

#### `parse.spaceSeparated(input)`

Splits space-separated string → string array.

```ts
parse.spaceSeparated('foo  bar baz') // ['foo', 'bar', 'baz']
```

#### `parse.lines(input)`

Splits multiline string → string array (system EOL aware).

```ts
parse.lines('foo\nbar\n\nbaz') // ['foo', 'bar', 'baz']
```

#### `parse.csv(input)`

Parses multiline CSV → 2D string array.

```ts
parse.csv('foo, bar\nbaz, qux')
// [['foo','bar'], ['baz','qux']]
```

---

## Type Utilities

Compile-time string transformations:

* **`CamelToKebab<S>`** → `"noEdit"` → `"no-edit"`
* **`KebabToCamel<S>`** → `"no-edit"` → `"noEdit"`
* **`Prefix<P, S>`** → prepend `P` to `S`
* **`Suffix<S, P>`** → append `P` to `S`

```ts
type A = CamelToKebab<'noEdit'>   // 'no-edit'
type B = KebabToCamel<'no-edit'>  // 'noEdit'
type C = Prefix<'pre-', 'fix'>    // 'pre-fix'
type D = Suffix<'file', '.ts'>    // 'file.ts'
```

---

## Design Notes

* Uses `regex` constants for strict type guards.
* `cleanArr` is the base sanitizer used across parsing helpers.
* Type utilities ensure **static correctness** at compile-time (e.g. `CamelToKebab<'fooBar'>` yields `'foo-bar'`).
* Parsing functions always return clean arrays (no empty strings).

## ⚖️ License

MIT – © 2025 [Nolan Gajdascz](https://github.com/gajdascz)
[GitHub](https://github.com/gajdascz/toolbox-ts) | [NPM](https://npmjs.com/package/@toolbox-ts)