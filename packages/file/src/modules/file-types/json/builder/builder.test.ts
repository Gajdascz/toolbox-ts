import { expect, it, describe } from 'vitest';
import { stringify } from 'comment-json';
import { build } from './builder.ts';

const EX_1 = `{
  // This is the name of the person
  "name": "John Doe",
  // This is the age of the person
  "age": 30,
  /*
   * This is a block comment
   */
  "hello": "world",
  "inline": "comment" // This is an inline comment
  ,
  "nested": {
    // This is a nested comment
    "value": "nested value"
  },
  // This is an array comment
  "array": [
    1,
    "2",
    {
      "nestedInArray": "value"
    }
  ]
}`;
describe('File.Json.build()', () => {
  it('should build a JSON object with comments', () => {
    const obj = build(
      {
        key: 'name',
        value: 'John Doe',
        comment: { type: 'LineComment', value: ' This is the name of the person' }
      },
      {
        key: 'age',
        value: 30,
        comment: { type: 'LineComment', value: ' This is the age of the person' }
      },
      {
        key: 'hello',
        value: 'world',
        comment: { type: 'BlockComment', value: 'This is a block comment' }
      },
      {
        key: 'inline',
        value: 'comment',
        comment: { type: 'LineComment', value: ' This is an inline comment', inline: true }
      },
      {
        key: 'nested',
        value: {
          key: 'value',
          value: 'nested value',
          comment: { type: 'LineComment', value: ' This is a nested comment' }
        }
      },
      {
        key: 'array',
        value: [1, '2', { key: 'nestedInArray', value: 'value' }],
        comment: { type: 'LineComment', value: ' This is an array comment' }
      }
    );
    expect(stringify(obj, null, 2)).toBe(EX_1);
  });
});
