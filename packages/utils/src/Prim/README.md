# @toolbox-ts/utils Prim

`Prim` provides **type-safe, primitive-focused utilities** for TypeScript: type guards, introspection, and value checks. It is designed to be a lightweight, centralized module for working with JavaScript primitive types in a type-aware way.

---

## 🔑 Features

* Type guards for all JavaScript primitive types: `string`, `number`, `boolean`, `symbol`, `bigint`, `null`, `undefined`, and `function`.
* Consistent API for safe runtime type checking.
* Generic type support for better TypeScript inference.
* Minimal, dependency-free, and lightweight.

---

## 🧩 API Overview

### Types

| Type      | Description                                         |           |            |        |          |          |          |               |
| --------- | --------------------------------------------------- | --------- | ---------- | ------ | -------- | -------- | -------- | ------------- |
| `Type`    | \`'bigint'                                          | 'boolean' | 'function' | 'null' | 'number' | 'string' | 'symbol' | 'undefined'\` |
| `Value`   | Union of all primitive values + functions           |           |            |        |          |          |          |               |
| `TypeMap` | Maps primitive type names to their TypeScript types |           |            |        |          |          |          |               |

### Type Guards

The `isTypeOf` object contains type guards for all primitives:

| Method                       | Description                                                                                 |
| ---------------------------- | ------------------------------------------------------------------------------------------- |
| `isTypeOf.string(v)`         | Checks if `v` is a string                                                                   |
| `isTypeOf.number(v)`         | Checks if `v` is a number                                                                   |
| `isTypeOf.boolean(v)`        | Checks if `v` is a boolean                                                                  |
| `isTypeOf.bigint(v)`         | Checks if `v` is a bigint                                                                   |
| `isTypeOf.symbol(v)`         | Checks if `v` is a symbol                                                                   |
| `isTypeOf.function(v)`       | Checks if `v` is a function                                                                 |
| `isTypeOf.null(v)`           | Checks if `v` is exactly `null`                                                             |
| `isTypeOf.undefined(v)`      | Checks if `v` is exactly `undefined`                                                        |
| `isTypeOf.type(p, options?)` | Checks if `p` is a string representing a primitive type; optionally allow null or undefined |

---

## 🧪 Usage Examples

```ts
import { isTypeOf } from '@toolbox-ts/prim';

const a: unknown = 'hello';
if (isTypeOf.string(a)) {
  // a is now typed as string
  console.log(a.toUpperCase());
}

const b: unknown = 42;
if (isTypeOf.number(b)) {
  console.log(b + 1); // type-safe addition
}

const maybeNull: unknown = null;
if (isTypeOf.null(maybeNull)) {
  console.log('It is null!');
}

const typeName: unknown = 'string';
if (isTypeOf.type(typeName, { allowNull: true })) {
  console.log(`Valid primitive type: ${typeName}`);
}
```

---

## ⚡ Notes

* `Prim` is **fully type-safe** and lightweight.
* Works well as a foundational dependency for other utility modules like `Obj` and `Str`.
* Designed for **TypeScript-first** workflows with minimal runtime overhead.

## ⚖️ License

MIT – © 2025 [Nolan Gajdascz](https://github.com/gajdascz)
[GitHub](https://github.com/gajdascz/toolbox-ts) | [NPM](https://npmjs.com/package/@toolbox-ts)