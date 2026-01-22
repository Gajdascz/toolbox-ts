import type {
  DepthReadonly,
  Descriptor,
  Entries,
  InferPrototype,
  Key,
  Keys,
  SymbolEntry,
  Symbols,
  Values
} from '@toolbox-ts/types/defs/object';

import {
  assertIsObjectPlain,
  isObject,
  isObjectPlain
} from '../../../../core/guards/objs/base/index.js';
//#region> Base with assertions
/**
 * Returns all own enumerable string keys of a plain-object as a typed array.
 *
 *
 * @important Indexing the object with these keys will require assertions due to TypeScript limitations. Use provided iterative methods to safely access the values.
 *
 * @template T - Plain Object (\{\}) type
 * @throws `TypeError` If the input is not an object
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys}
 *
 * @example
 * ```ts
 * const obj = { a: 1, b: 2, 0: 3 };
 * const keysArray = keys(obj); // type: ('a' | 'b' | '0')[]
 * console.log(keysArray); // Output: ['a', 'b', '0']
 * ```
 */
export const keys = <const T>(obj: T): Keys<T> => {
  assertIsObjectPlain(obj);
  return Object.keys(obj) as Keys<T>;
};

/**
 * Returns all entries (own enumerable string-keyed-value pairs) of a plain-object as a typed array.
 *
 * @template T - Plain Object (\{\}) type
 * @throws `TypeError` If the input is not an object
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries}
 *
 * @example
 * ```ts
 * const obj = { a: 1, b: 2, 0: 3 };
 * const entriesArray = entries(obj); // type: (['a', 1] | ['b', 2] | ['0', 3])[]
 * console.log(entriesArray); // Output: [['a', 1], ['b', 2], ['0', 3]]
 * ```
 */
export const entries = <const T>(obj: T): Entries<T> => {
  assertIsObjectPlain(obj);
  return Object.entries(obj) as Entries<T>;
};
/**
 * Returns all values of an object's own enumerable string-keyed properties as a typed array.
 *
 * @template T - Plain Object (\{\}) type
 * @throws `TypeError` If the input is not an object
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/values}
 *
 * @example
 * ```ts
 * const obj = { a: 1, b: 2, 0: 3 };
 * const valuesArray = values(obj); // type: (1 | 2 | 3)[]
 * console.log(valuesArray); // Output: [1, 2, 3]
 * ```
 *
 */
export const values = <const T>(obj: T): Values<T> => {
  assertIsObjectPlain(obj);
  return Object.values(obj) as Values<T>;
};
/**
 * Returns an array of all symbol properties found directly on object o.
 * - Excludes symbols from the prototype chain
 * - Coerces the input to an object
 *
 * @param o - The object from which to retrieve the symbol properties.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertySymbols}
 *
 * @example
 * ```ts
 * const protoSym = Symbol('protoSym');
 * const sym1 = Symbol('sym1');
 * const sym2 = Symbol('sym2');
 * const obj = Object.create({[protoSym]: 'from prototype'}, {
 *   [sym1]: { value: 'symbol 1', enumerable: true },
 *   [sym2]: { value: 'symbol 2', enumerable: false },
 * });
 *
 * console.log(Object.getOwnPropertySymbols(obj)); // [ Symbol(sym1), Symbol(sym2) ]
 * // Note: 'protoSym' is not included since it's from the prototype
 * ```
 */
export const symbols = Object.getOwnPropertySymbols as <const T>(
  obj: T
) => Symbols<T>;

/**
 * Returns an array of [symbol, value] pairs for all own symbol properties of the given object.
 *
 * @param obj - The object from which to retrieve the symbol entries.
 * @returns An array of [symbol, value] pairs.
 *
 * @example
 * ```ts
 * const sym1 = Symbol('sym1');
 * const sym2 = Symbol('sym2');
 * const obj = {
 *   [sym1]: 'value1',
 *   [sym2]: 'value2'
 * };
 * console.log(symbolEntries(obj)); // [ [Symbol(sym1), 'value1'], [Symbol(sym2), 'value2'] ]
 * ```
 */
export const symbolEntries = <const T>(obj: T): SymbolEntry<T>[] =>
  symbols(obj).map((sym) => [sym, obj[sym]]);

/**
 * Returns all enumerable entries of a plain object + all symbol entries.
 *
 * @template T - Plain Object (\{\}) type
 *
 * @example
 * ```ts
 * const sym1 = Symbol('sym1');
 * const sym2 = Symbol('sym2');
 * const obj = {
 *   a: 1,
 *   b: 2,
 *   [sym1]: 'value1',
 *   [sym2]: 'value2'
 * };
 * console.log(allEntries(obj)); // [ ['a', 1], ['b', 2], [Symbol(sym1), 'value1'], [Symbol(sym2), 'value2'] ]
 * ```
 */
export const allEntries = <const T>(
  obj: T
): [Key.String<T> | Key.Symbol<T>, T[keyof T]][] =>
  [...entries(obj), ...symbolEntries(obj)] as [
    Key.String<T> | Key.Symbol<T>,
    T[keyof T]
  ][];
//#endregion

//#region> Documented Aliases
/**
 * Gets the own property descriptor of the specified object. An own property descriptor is one that is defined directly on the object and is not inherited from the object's prototype.
 *
 * @param o - The object from which to get the property descriptor.
 * @param p - The name of the property whose descriptor is to be retrieved.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor}
 *
 * @example
 * ```ts
 * const obj = { a: 1, b: 2 };
 * const descriptor = descriptors(obj, 'a');
 * console.log(descriptor);
 * // Output: { value: 1, writable: true, enumerable: true, configurable: true }
 * ```
 */
export const descriptors = Object.getOwnPropertyDescriptor;
/**
 * Returns an object containing all own property descriptor of an object
 *
 * @param o - Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
 */
export const descriptor = Object.getOwnPropertyDescriptor;
/**
 * Returns an array of all own property names of an object.
 * - Includes non-enumerable properties
 * - Excludes symbol properties and items on the prototype chain
 * - Coerces the input to an object
 *
 * @param o - The object from which to retrieve the property names.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames}
 *
 * @example
 * ```ts
 * const obj = Object.create({ thisIsAPrototype: true }, {
 *   prop1: { value: 42, enumerable: true },
 *   prop2: { value: 'hello', enumerable: false },
 *   [Symbol('sym')]: { value: 'symbol', enumerable: true },
 * });
 * console.log(Object.getOwnPropertyNames(obj)); // ['prop1', 'prop2']
 * // Note: 'thisIsAPrototype' and the symbol property are not included
 * ```
 */
export const propertyNames = Object.getOwnPropertyNames;

/**
 * Prevents the addition of new properties to an object.
 *
 * @template T - Object to make non-extensible.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/preventExtensions
 *
 * @example
 * ```ts
 * const obj = { a: 1, b: 2 };
 * Object.preventExtensions(obj);
 * obj.a = 2; // OK
 * obj.c = 3; // Error: Cannot add property b, object is not extensible
 * delete obj.b; // OK
 * obj.b = 2; // Error: Cannot add property b, object is not extensible (after deletion)
 * ```
 */
export const preventExtensions = Object.preventExtensions;
/**
 * Prevents the modification of attributes of existing properties, and prevents the addition of new properties.
 *
 * @template T - Object on which to lock the attributes.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/seal
 *
 * Sealed objects:
 *  - property values can be changed.
 *  - cannot have new properties added (extended) and can not have existing properties deleted.
 *  - existing properties cannot be reconfigured (cannot change property descriptor).
 *  - the prototype of the object cannot be changed.
 *
 * @example
 * ```ts
 * const sealed = Obj.seal({ a: 1, b: 2, c: { d:true } });
 *
 * sealed.a = 2; // OK
 * sealed.d = 4; // Error: Cannot add property d, object is not extensible
 * delete sealed.b; // Error: Cannot delete property 'b' of #<Object>
 * ```
 *
 */
export const seal = Object.seal;
/**
 *Copy the values of all of the enumerable own properties from one or more source objects to a target object. Returns the target object.
 *
 * @template T - The target object to copy to.
 * @template U - The source object(s) from which to copy properties.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign}
 *
 * @example
 * ```ts
 * const target = { a: 1 };
 * const source1 = { b: 2 };
 * const source2 = { c: 3 };
 * const result = assign(target, source1, source2);
 * console.log(result); // { a: 1, b: 2, c: 3 }
 * console.log(target); // { a: 1, b: 2, c: 3 } (target is mutated)
 * ```
 */
export const assign = Object.assign;
/**
 * Creates an object from an iterable of key-value pairs.
 *
 * @template K - Key type
 * @template V - Value type
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/fromEntries}
 * @example
 * ```ts
 * const entries = [['a', 1], ['b', 2], ['c', 3]];
 * const obj = fromEntries(entries);
 * console.log(obj); // { a: 1, b: 2, c: 3 }
 * ```
 */
export const fromEntries = Object.fromEntries;
/**
 * Groups members of an iterable according to the return value of the passed callback.
 *
 * Returns a record where keys are the return values of the callback and values are arrays
 * of items that returned that key. Unlike the native `Object.groupBy`, this wrapper
 * provides stronger typing where returned keys are guaranteed to have non-undefined arrays.
 *
 * @template K - Type of keys to group by (PropertyKey)
 * @template T - Type of items in the iterable
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/groupBy}
 *
 * @example
 * ```ts
 * const numbers = [6.1, 4.2, 6.3];
 * const grouped = groupBy(numbers, Math.floor);
 * console.log(grouped);
 * // Output: { 4: [4.2], 6: [6.1, 6.3] }
 * // Type: Record<number, number[]> (no undefined!)
 *
 * const words = ['apple', 'apricot', 'banana'];
 * const byFirstLetter = groupBy(words, (w) => w[0]);
 * // Type: Record<string, string[]>
 * ```
 */
export const groupBy = Object.groupBy as <const K extends PropertyKey, const T>(
  items: Iterable<T>,
  keySelector: (item: T, index: number) => K
) => Record<K, T[]>;

//#endregion

//#region> Asserted Aliases
/**
 * Returns the prototype of an object.
 * - Coerces the input to an object
 *
 * @template T - The object that references the prototype.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getPrototypeOf}
 *
 * @example
 * ```ts
 * const proto = {
 *   greet() {
 *     return 'hello';
 *   }
 * };
 * const obj = create(proto);
 * const result = getPrototypeOf(obj);
 * console.log(result === proto); // true
 * ```
 */
export const getPrototypeOf = Object.getPrototypeOf as <const T>(
  obj: T
) => InferPrototype<T>;
/**
 *
 * Adds one or more properties to an object, and/or modifies attributes of existing properties.
 *
 * @template T - Object on which to add or modify the properties. This can be a native JavaScript object or a DOM object.
 * @template P - Object that contains one or more descriptor objects. Each descriptor object describes a data property or an accessor property.
 * @template NarrowProperties - Whether to use narrow type inference (default: false)
 *
 * @important To preserve typing across mutations, you must assign the returned object back to a new variable.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties}
 *
 * @example
 * ```ts
 * const obj = { a: 1 };
 * const updatedObj = defineProperties(obj, {
 *   b: { value: 2, writable: true },
 *   c: { value: 3, enumerable: false }
 * });
 * console.log(updatedObj); // { a: 1, b: 2 }
 * console.log(Object.getOwnPropertyDescriptor(updatedObj, 'c'));
 * // { value: 3, writable: false, enumerable: false, configurable: false }
 * ```
 */
export const defineProperties = Object.defineProperties as <
  T,
  P extends PropertyDescriptorMap,
  NarrowProperties extends boolean = false
>(
  obj: T,
  properties: P
) => Descriptor.InferValueMap<P, NarrowProperties> & T;
/**
 * Adds a property to an object, or modifies attributes of an existing property.
 *
 * @template T - Object on which to add or modify the property. This can be a native JavaScript object (that is, a user-defined object or a built in object) or a DOM object.
 * @template P - The property name.
 * @template A - Descriptor for the property. It can be for a data property or an accessor property.
 *
 * @important To preserve typing across mutations, you must assign the returned object back to a new variable.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty}
 *
 * @example
 * ```ts
 * const obj = { a: 1 };
 * const updatedObj = defineProperty(obj, 'b', {
 *   value: 2,
 *   writable: true,
 *   enumerable: true,
 *   configurable: true
 * });
 * console.log(updatedObj); // { a: 1, b: 2 }
 * ```
 */
export const defineProperty = Object.defineProperty as <
  T,
  P extends PropertyKey,
  A extends PropertyDescriptor
>(
  obj: T,
  prop: P,
  attributes: A
) => { [K in P]: Descriptor.InferValue<A> } & T;

//#region> Create
export interface Create {
  <T extends null | object>(proto: T): T extends null ? object : {} & T;
  <
    T extends null | object,
    P extends PropertyDescriptorMap,
    NarrowProperties extends boolean = false
  >(
    proto: T,
    properties: P
  ): Descriptor.InferValueMap<P, NarrowProperties>
    & (T extends null ? object : {} & T);
}
/**
 * Creates a new object with the specified prototype and optional properties.
 *
 * @template T - Prototype object type (null or object)
 * @template P - Property descriptor map
 * @template NarrowProperties - Whether to use narrow type inference (default: false)
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create}
 *
 * @example
 * ```ts
 * // Without properties - returns prototype type
 * const proto = { greet() { return 'hello'; } };
 * const obj1 = create(proto); // typeof proto with inherited methods
 *
 * // With wide properties - combines prototype + defined properties
 * const obj2 = create(proto, {
 *   name: { value: 'Alice', writable: true }
 * }); // {
 *   [key: string]: unknown;
 *   [key: symbol]: unknown;
 *   [key: number]: unknown;
 *   name: string;
 * } & typeof proto;
 * // With narrow properties - removes index signatures
 * const obj3 = create(proto, {
 *  age: { value: 30, writable: true },
 *  isAdmin: { value: true, writable: false }
 * }); // {
 *   age: number;
 *   isAdmin: boolean;
 * } & typeof proto;
 *
 * ```
 */
export const create: Create = Object.create;
//#endregion

//#endregion

//#region> Freeze
export interface FreezeOpts<T, D extends number = 0> {
  /**
   * Clone before freezing to avoid mutating the original object.
   * - If `true`, uses `structuredClone` by default
   * - If a function, uses the provided function to clone the object
   * - If `false` or omitted, freezes the original object (mutates)
   */
  clone: ((obj: T, ...args: any[]) => T) | boolean;
  /**
   * Depth of recursive freezing:
   * - `0` → freeze only the top-level object/array/collection
   * - `1` → freeze top-level + all direct children
   * - `n` → freeze `n` levels deep
   *
   * Depth applies uniformly to:
   * - Plain objects (enumerable properties)
   * - Arrays (indexed items)
   * - Maps (keys and values)
   * - Sets (items)
   *
   * @important Non-recursive types (Date, RegExp, Error, class instances, etc.)
   * are shallow frozen regardless of depth.
   *
   * @example
   * ```ts
   * const data = {
   *   arr: [{ nested: 1 }],           // arr=depth1, item=depth2, nested=depth3
   *   map: new Map([['k', { v: 2 }]]), // map=depth1, value=depth2, v=depth3
   *   obj: { nested: { deep: 3 } }    // obj=depth1, nested=depth2, deep=depth3
   * };
   *
   * freeze(data, { maxDepth: 0 });
   * Object.isFrozen(data);           // true
   * Object.isFrozen(data.arr);       // false
   * Object.isFrozen(data.map);       // false
   * Object.isFrozen(data.obj);       // false
   *
   * freeze(data, { maxDepth: 1 });
   * Object.isFrozen(data.arr);       // true
   * Object.isFrozen(data.arr[0]);    // false (depth 2)
   * Object.isFrozen(data.map);       // true
   * Object.isFrozen(data.obj);       // true
   * Object.isFrozen(data.obj.nested); // false (depth 2)
   *
   * freeze(data, { maxDepth: 2 });
   * Object.isFrozen(data.arr[0]);         // true
   * Object.isFrozen(data.arr[0].nested);  // false (depth 3)
   * Object.isFrozen(data.obj.nested);     // true
   * Object.isFrozen(data.obj.nested.deep); // false (depth 3)
   * ```
   */
  maxDepth: D;
}
const recursiveFreeze = <const T, const D extends number = 0>(
  obj: T,
  maxDepth: D,
  currDepth = 0
): DepthReadonly<T, D> => {
  if (!isObject(obj) || Object.isFrozen(obj) || currDepth > maxDepth)
    return obj as DepthReadonly<T, D>;

  if (Array.isArray(obj))
    for (const item of obj) recursiveFreeze(item, maxDepth, currDepth + 1);
  else if (obj instanceof Map)
    for (const [k, v] of obj) {
      recursiveFreeze(k, maxDepth, currDepth + 1);
      recursiveFreeze(v, maxDepth, currDepth + 1);
    }
  else if (obj instanceof Set)
    for (const item of obj) recursiveFreeze(item, maxDepth, currDepth + 1);
  else if (isObjectPlain(obj))
    for (const key of keys(obj))
      recursiveFreeze(obj[key as keyof T], maxDepth, currDepth + 1);

  return Object.freeze(obj) as DepthReadonly<T, D>;
};
/**
 * Recursively freezes an object up to a specified depth.
 *
 * **Recursive freezing applies to:**
 * - Plain objects (`{}`)
 * - Arrays (`[]`)
 * - Maps (`Map`)
 * - Sets (`Set`)
 *
 * **Shallow freezing only (not recursed into):**
 * - Date, RegExp, Error, ArrayBuffer, TypedArrays
 * - Class instances and other built-in objects
 *
 * **Behavior:**
 * - Skips already frozen objects (handles circular references)
 * - Primitives are returned unchanged
 * - Depth is counted uniformly across all recursive types
 *
 * @template T - Object type to freeze
 * @template D - Maximum depth (default: 0 = shallow freeze)
 *
 * @param obj - The object to freeze
 * @param options - Freeze options
 * @returns A deeply readonly version of the input object
 *
 * @example
 * ```ts
 * // Shallow freeze (default)
 * const obj = { a: { b: 1 } };
 * freeze(obj);
 * Object.isFrozen(obj);    // true
 * Object.isFrozen(obj.a);  // false
 *
 * // Deep freeze
 * freeze(obj, { maxDepth: 2 });
 * Object.isFrozen(obj.a);  // true
 *
 * // Clone before freezing
 * const original = { x: 1 };
 * const frozen = freeze(original, { clone: true });
 * Object.isFrozen(frozen);    // true
 * Object.isFrozen(original);  // false
 *
 * // Freeze collections
 * const map = new Map([['key', { value: 1 }]]);
 * freeze(map, { maxDepth: 2 });
 * Object.isFrozen(map);                    // true
 * Object.isFrozen(map.get('key'));         // true
 * Object.isFrozen(map.get('key').value);   // false (depth 3)
 * ```
 */
export const freeze = <const T, const D extends number = 0>(
  obj: T,
  { clone, maxDepth = 0 as D }: Partial<FreezeOpts<T, D>> = {}
): DepthReadonly<T, D> => {
  const target =
    !clone ? obj
    : clone === true ? structuredClone(obj)
    : clone(obj);

  return maxDepth === 0 ?
      (Object.freeze(target) as DepthReadonly<T, D>)
    : recursiveFreeze(target, maxDepth);
};
//#endregion

/**
 * Creates a new object with the same prototype as the given object.
 *
 * @template T - The type of the object to create
 * @param object - The object whose prototype to use
 * @returns A new object with the same prototype as the given object
 *
 * @example
 * ```ts
 * const obj = { a: 1 };
 * const newObj = createWithPrototypeOf<typeof obj>(obj);
 * Object.getPrototypeOf(newObj) === Object.getPrototypeOf(obj); // true
 * ```
 */
export const createWithPrototypeOf = <const T>(object: T): T =>
  create(Object.getPrototypeOf(object)) as T;
