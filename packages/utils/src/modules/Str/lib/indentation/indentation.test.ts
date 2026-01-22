import { EOL } from 'node:os';
import { describe, expect, it } from 'vitest';

import { block, create, type IndentBlockLines, line } from './indentation.ts';

describe('indentation', () => {
  describe('line', () => {
    it('indents with default settings', () => {
      expect(line('hello')).toBe('hello');
      expect(line('hello', 1)).toBe('  hello');
      expect(line('hello', 2)).toBe('    hello');
    });

    it('adds EOL when requested', () => {
      expect(line('hello', 0, true)).toBe(`hello${EOL}`);
      expect(line('hello', 1, true)).toBe(`  hello${EOL}`);
      expect(line('hello', 0, false)).toBe('hello');
    });

    it('uses custom eolChar', () => {
      expect(line('hello', 0, true, { eolChar: '\r\n' })).toBe('hello\r\n');
    });

    it('uses custom unitChar', () => {
      expect(line('hello', 1, false, { unitChar: '\t', indentSize: 1 })).toBe(
        '\thello'
      );
      expect(line('hello', 2, false, { unitChar: '\t', indentSize: 1 })).toBe(
        '\t\thello'
      );
    });

    it('uses custom indentSize', () => {
      expect(line('hello', 1, false, { indentSize: 4 })).toBe('    hello');
      expect(line('hello', 2, false, { indentSize: 4 })).toBe('        hello');
    });

    it('combines all custom options', () => {
      expect(
        line('hello', 2, true, {
          eolChar: '\r\n',
          unitChar: '\t',
          indentSize: 1
        })
      ).toBe('\t\thello\r\n');
    });
  });

  describe('block', () => {
    it('handles empty lines array', () => {
      expect(block([])).toBe('');
    });

    it('handles all eol behavior by default', () => {
      const lines: IndentBlockLines = [['line1'], ['line2'], ['line3']];
      expect(block(lines)).toBe(`line1${EOL}line2${EOL}line3${EOL}`);
    });

    it('handles all eol behavior explicitly', () => {
      const lines: IndentBlockLines = [['line1'], ['line2']];
      expect(block(lines, 'all')).toBe(`line1${EOL}line2${EOL}`);
    });

    it('handles final eol behavior', () => {
      const lines: IndentBlockLines = [['line1'], ['line2'], ['line3']];
      expect(block(lines, 'final')).toBe(`line1line2line3${EOL}`);
    });

    it('handles perLine eol behavior', () => {
      const lines: IndentBlockLines = [
        ['line1', 0, true],
        ['line2', 0, false],
        ['line3', 0, true]
      ];
      expect(block(lines, 'perLine')).toBe(`line1${EOL}line2line3${EOL}`);
    });

    it('applies indent levels', () => {
      const lines: IndentBlockLines = [
        ['line1', 0],
        ['line2', 1],
        ['line3', 2]
      ];
      expect(block(lines, 'final')).toBe(`line1  line2    line3${EOL}`);
    });

    it('handles function lines', () => {
      const lines: IndentBlockLines = [
        [() => 'computed1'],
        [() => 'computed2', 1]
      ];
      expect(block(lines, 'final')).toBe(`computed1  computed2${EOL}`);
    });

    it('handles undefined function results', () => {
      const lines: IndentBlockLines = [['line1'], [() => undefined], ['line2']];
      expect(block(lines, 'final')).toBe(`line1line2${EOL}`);
    });

    it('handles undefined line values', () => {
      const lines: IndentBlockLines = [['line1'], [undefined], ['line2']];
      expect(block(lines, 'final')).toBe(`line1line2${EOL}`);
    });

    it('uses custom options', () => {
      const lines: IndentBlockLines = [
        ['line1', 1],
        ['line2', 2]
      ];
      expect(
        block(lines, 'all', { eolChar: '\r\n', unitChar: '\t', indentSize: 1 })
      ).toBe('\tline1\r\n\t\tline2\r\n');
    });

    it('handles mixed scenarios', () => {
      const lines: IndentBlockLines = [
        ['header', 0, true],
        [() => 'body', 1, false],
        [undefined],
        [() => undefined],
        ['footer', 0, false]
      ];
      expect(block(lines, 'perLine')).toBe(`header${EOL}  bodyfooter`);
    });
  });

  describe('create', () => {
    it('creates indenter with default settings', () => {
      const indent = create();
      expect(indent('hello', 0, false)).toBe('hello');
      expect(indent('hello', 1, false)).toBe('  hello');
      expect(indent('hello', 0, true)).toBe(`hello${EOL}`);
      expect(indent.eolChar).toBe(EOL);
    });

    it('creates indenter with custom indentSize', () => {
      const indent = create(4);
      expect(indent('hello', 1, false)).toBe('    hello');
      expect(indent('hello', 2, false)).toBe('        hello');
    });

    it('creates indenter with custom eolChar', () => {
      const indent = create(2, '\r\n');
      expect(indent('hello', 0, true)).toBe('hello\r\n');
      expect(indent.eolChar).toBe('\r\n');
    });

    it('creates indenter with custom wsChar', () => {
      const indent = create(1, EOL, '\t');
      expect(indent('hello', 1, false)).toBe('\thello');
      expect(indent('hello', 2, false)).toBe('\t\thello');
    });

    it('creates indenter with all custom options', () => {
      const indent = create(3, '\r\n', '-');
      expect(indent('hello', 1, true)).toBe('---hello\r\n');
      expect(indent.eolChar).toBe('\r\n');
    });

    it('handles single line string input', () => {
      const indent = create();
      expect(indent('line', 0, false)).toBe('line');
      expect(indent('line', 1, false)).toBe('  line');
      expect(indent('line', 2, false)).toBe('    line');
      expect(indent('line', 0, true)).toBe(`line${EOL}`);
      expect(indent('line', 1, true)).toBe(`  line${EOL}`);
    });

    it('handles block array input with default eol behavior', () => {
      const indent = create();
      const lines: IndentBlockLines = [['line1'], ['line2']];
      expect(indent(lines, 'all')).toBe(`line1${EOL}line2${EOL}`);
    });

    it('handles block array input with all eol behavior', () => {
      const indent = create();
      const lines: IndentBlockLines = [['line1'], ['line2']];
      expect(indent(lines, 'all')).toBe(`line1${EOL}line2${EOL}`);
    });

    it('handles block array input with final eol behavior', () => {
      const indent = create();
      const lines: IndentBlockLines = [['line1'], ['line2']];
      expect(indent(lines, 'final')).toBe(`line1line2${EOL}`);
    });

    it('handles block array input with perLine eol behavior', () => {
      const indent = create();
      const lines: IndentBlockLines = [
        ['line1', 0, true],
        ['line2', 0, false]
      ];
      expect(indent(lines, 'perLine')).toBe(`line1${EOL}line2`);
    });

    it('applies custom settings to block input', () => {
      const indent = create(4, '\r\n', '\t');
      const lines: IndentBlockLines = [
        ['line1', 1],
        ['line2', 2]
      ];
      expect(indent(lines, 'all')).toBe(
        '\t\t\t\tline1\r\n\t\t\t\t\t\t\t\tline2\r\n'
      );
    });

    it('handles function lines in block input', () => {
      const indent = create();
      const lines: IndentBlockLines = [[() => 'func1'], [() => 'func2', 1]];
      expect(indent(lines, 'final')).toBe(`func1  func2${EOL}`);
    });

    it('handles undefined lines in block input', () => {
      const indent = create();
      const lines: IndentBlockLines = [
        ['line1'],
        [undefined],
        [() => undefined],
        ['line2']
      ];
      expect(indent(lines, 'final')).toBe(`line1line2${EOL}`);
    });
  });
});
