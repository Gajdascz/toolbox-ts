import type { Nullish } from '@toolbox-ts/types';

//#region> Normalize
export interface NormalizeFileDataOptions {
  bufferEncoding?: Parameters<InstanceType<typeof Buffer>['toString']>[0];
  dateHandler?: {
    [K in keyof Date]: Date[K] extends () => string ? K : never;
  }[keyof Date];
  jsonHandler?: (data: object) => string;
  nullishHandler?: (data: Nullish) => string;
  stringHandler?: (data: string) => string;
  unknownHandler?: (data: unknown) => string;
}
/**
 * Normalize various data types to a string.
 * - `null` or `undefined` become an empty string.
 * - `string` is returned as-is.
 * - `Buffer` and `Uint8Array` are converted to strings using the specified encoding (default is 'utf8').
 * - `Date` is converted to an ISO string.
 * - `object` is serialized to a JSON string with 2-space indentation.
 * - Other types are converted to strings using their `toString` method.
 *
 * @example
 * ```ts
 * normalizeFileData(null); // ''
 * normalizeFileData(undefined); // ''
 * normalizeFileData('Hello, World!'); // 'Hello, World!'
 * normalizeFileData(Buffer.from('Hello, Buffer!')); // 'Hello, Buffer!'
 * normalizeFileData(new Uint8Array([72, 101, 108, 108, 111])); // 'Hello'
 * normalizeFileData(new Date('2023-10-01T12:00:00Z')); // '
 * 2023-10-01T12:00:00.000Z'
 * normalizeFileData({ key: 'value' }); // '{\n  "key": "value"\n}'
 * normalizeFileData(123); // '123'
 * ```
 */
export const normalizeFileData = (
  data: unknown,
  {
    bufferEncoding = 'utf8',
    dateHandler = 'toISOString',
    jsonHandler = () => JSON.stringify(data, null, 2),
    stringHandler = (d) => d,
    unknownHandler = String,
    nullishHandler = () => ''
  }: NormalizeFileDataOptions = {}
): string => {
  if (data === null || data === undefined) return nullishHandler(data);
  if (typeof data === 'string') return stringHandler(data);
  if (data instanceof Buffer) return data.toString(bufferEncoding);
  if (data instanceof Uint8Array) return Buffer.from(data).toString(bufferEncoding);
  if (data instanceof Date) return data[dateHandler]();
  if (typeof data === 'object') return jsonHandler(data);
  return unknownHandler(data);
};
//#endregion
