
# @toolbox-ts/utils Obj

`Obj` is a collection of **safe, type-aware utilities** for working with objects in TypeScript.
It includes type guards, cloning, merging, freezing, filtering, and advanced type transformations.

---

## 🔑 Features

* **Type guards**: narrow `unknown` values to precise object shapes.
* **Structural utilities**: deep clone, deep freeze, strip nullish, merge with custom array behavior.
* **Key/value helpers**: `keys`, `entries`, `pick`, `omit`, `pluck`, `filter`.
* **Type-level utilities**: nested partial/required/readonly, key omission, value filtering.
* **Array merge strategies**: append, prepend, overwrite, with optional dedupe + filter.
* **Recursive safety**: skips prototype pollution (`__proto__`, `constructor`, `prototype`).

---

## 🧩 API Overview

### Object Guards & Checks

| API                                  | Description                                                       |
| ------------------------------------ | ----------------------------------------------------------------- |
| `is.obj(value, hasKeys?)`            | Type guard: non-null object, optionally containing required keys. |
| `is.strKeyOf(key, obj)`              | Checks if `key` is a string and exists on object.                 |
| `is.symbolKeyOf(key, obj)`           | Checks if `key` is a symbol and exists on object.                 |
| `is.empty(obj)`                      | True if object has no own enumerable keys.                        |
| `is.partialOf(partial, established)` | Checks if `partial` structurally matches `established`.           |
| `is.prototypeKey(key)`               | Guards against prototype pollution keys.                          |

---

### Structural Utilities

| API                                 | Description                                                           |
| ----------------------------------- | --------------------------------------------------------------------- |
| `clone(obj)`                        | Deep clone object/array recursively.                                  |
| `freeze(obj, { clone?, maxDepth })` | Deep-freeze object up to given depth (default `1`).                   |
| `merge(current, next, opts?)`       | Recursively merge objects with array strategies + retain empty props. |
| `mergeArr(currArr, nextArr, opts?)` | Merge arrays with `append` (default), `prepend`, or `overwrite`.      |
| `stripNullish(obj)`                 | Remove all `null`/`undefined` values recursively.                     |

---

### Object Helpers

| API                 | Description                                                            |
| ------------------- | ---------------------------------------------------------------------- |
| `keys(obj)`         | Returns typed array of string keys.                                    |
| `entries(obj)`      | Returns typed `[key, value][]`.                                        |
| `pick(obj, keys)`   | New object with only the given keys.                                   |
| `omit(obj, keys)`   | New object without the given keys.                                     |
| `filter(obj, pred)` | New object with only values passing predicate.                         |
| `pluck(obj, key)`   | Map values to a single property key (1-level deep, must exist on all). |

---

### Type Utilities

| Type                      | Description                                                    |
| ------------------------- | -------------------------------------------------------------- |
| `ExtractOptional<T>`      | Extract optional properties.                                   |
| `ExtractRequired<T>`      | Extract required properties.                                   |
| `FilterRecord<T, R>`      | Keep only properties of type `R`.                              |
| `Mutable<T>`              | Remove `readonly` modifiers at top-level.                      |
| `NestedMutable<T>`        | Remove `readonly` recursively.                                 |
| `NestedPartial<T>`        | Make all props optional recursively.                           |
| `NestedRequired<T>`       | Make all props required recursively.                           |
| `NestedReadonly<T>`       | Make all props readonly recursively.                           |
| `OmitKeys<T, K>`          | Exclude keys `K`.                                              |
| `PartiallyOptional<T, K>` | Make only `K` optional (recursively).                          |
| `PartiallyRequired<T, K>` | Make only `K` required (recursively).                          |
| `PluckRecord<T, K>`       | Result type from `pluck`.                                      |
| `StripNullish<T>`         | Remove `null`/`undefined` types from object shape recursively. |
| `StrKey<T>`               | Extract only string keys.                                      |
| `StrRecord<V>`            | `{ [key: string]: V }`.                                        |
| `SymbolKey<T>`            | Extract only symbol keys.                                      |
| `Widen<T>`                | Convert literal types to their primitive counterparts.         |
| `Narrow<T>`               | Retain literal precision but widen non-literals.               |

---

## 📖 Usage Examples

### Deep merge objects with custom array strategy

```ts
import { merge } from '@toolbox-ts/utils/Obj';

const a = { ids: [1, 2], config: { retries: 2 } };
const b = { ids: [3, 4], config: { timeout: 100 } };

const result = merge(a, b, {
  array: { behavior: 'append', dedupe: true }
});
// { ids: [1,2,3,4], config: { retries:2, timeout:100 } }
```

---

### Clone & freeze

```ts
import { clone, freeze } from '@toolbox-ts/utils/Obj';

const original = { a: { b: 1 } };

const deepCopy = clone(original);
const frozen = freeze(original, { maxDepth: 2 });
```

---

### Strip nullish values

```ts
import { stripNullish } from '@toolbox-ts/utils/Obj';

const cleaned = stripNullish({
  a: 1,
  b: null,
  c: undefined,
  d: { e: 2, f: null }
});
// { a: 1, d: { e: 2 } }
```

---

### Key utilities

```ts
import { pick, omit, pluck, filter } from '@toolbox-ts/utils/Obj';

const user = { id: 1, name: 'Alice', role: 'admin' };

pick(user, ['id']); // { id: 1 }
omit(user, ['role']); // { id: 1, name: 'Alice' }

const data = {
  one: { id: 1, label: 'x' },
  two: { id: 2, label: 'y' }
};
pluck(data, 'id'); // { one: 1, two: 2 }

filter(user, (v): v is string => typeof v === 'string');
// { name: 'Alice', role: 'admin' }
```

---

### Type helpers

```ts
type User = {
  id: number;
  name?: string;
  readonly email: string;
  address?: { city: string };
};

type Optional = ExtractOptional<User>;   // { name?: string; address?: { city: string } }
type Required = ExtractRequired<User>;   // { id: number; email: string }
type MutableUser = NestedMutable<User>;  // all props lose readonly
type RequiredUser = NestedRequired<User>; // all props required
```

---

## ⚖️ License

MIT – © 2025 [Nolan Gajdascz](https://github.com/gajdascz)
[GitHub](https://github.com/gajdascz/toolbox-ts) | [NPM](https://npmjs.com/package/@toolbox-ts)