import { describe, expect, it } from 'vitest';

import { createTypeError } from './type.ts';

describe('createTypeError', () => {
  it('should create a TypeError with the correct message for a single expected type', () => {
    const error = createTypeError('string', 123);
    expect(error).toBeInstanceOf(TypeError);
    expect(error.message).toBe('Expected number to be of type string');
  });

  it('should create a TypeError with the correct message for multiple expected types', () => {
    const error = createTypeError(['string', 'number'], true);
    expect(error).toBeInstanceOf(TypeError);
    expect(error.message).toBe(
      'Expected boolean to be one of type [string, number]'
    );
  });

  it('should call the received function if it is a function', () => {
    const received = () => 'customType';
    const error = createTypeError('string', received);
    expect(error).toBeInstanceOf(TypeError);
    expect(error.message).toBe('Expected customType to be of type string');
  });
  it('should include the rest parameter in the error message if provided', () => {
    const error = createTypeError('string', 123, 'with some condition');
    expect(error).toBeInstanceOf(TypeError);
    expect(error.message).toBe(
      'Expected number to be of type string with some condition'
    );
  });
});
