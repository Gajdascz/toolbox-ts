import { describe, it, expect } from 'vitest';
import {
  listElement,
  orderedList,
  unorderedList,
  taskList,
  listItem,
  type ListNodes,
  type TaskListNodes
} from './list.ts';

describe('(blocks) list', () => {
  describe('listItem', () => {
    it('renders at level 0', () => {
      expect(listItem({ content: 'item', prefix: '-', level: 0 })).toBe('- item');
    });
    it('indents with TAB at level 1', () => {
      expect(listItem({ content: 'item', prefix: '1.', level: 1 })).toBe('\t1. item');
    });
  });

  describe('md', () => {
    const items: ListNodes = [
      { content: 'one' },
      { content: { text: 'Two', styles: { italic: 'i' } }, children: [] },
      {
        content: { text: 'Three', styles: { bold: 'md' } },
        children: [{ content: 'child1' }, { content: 'childLink' }]
      },
      'text node'
    ];

    it('unorderedList', () => {
      const result = unorderedList(items);
      expect(result.split('\n')[0]).toBe('- one');
      expect(result).toContain('- <i>Two</i>');
      expect(result).toContain('- **Three**');
      expect(result).toContain('\t- child1');
      expect(result).toContain('- text node');
    });

    it('orderedList', () => {
      const result = orderedList(items);
      expect(result.split('\n')[0]).toBe('1. one');
      expect(result).toContain('2. <i>Two</i>');
      expect(result).toContain('3. **Three**');
      expect(result).toContain('\t1. child1');
    });

    it('taskList unchecked', () => {
      const result = taskList(items);
      expect(result.split('\n')[0]).toBe('- [ ] one');
      expect(result).toContain('- [ ] <i>Two</i>');
      expect(result).toContain('- [ ] **Three**');
      expect(result).toContain('\t- [ ] child1');
      expect(result).toContain('- [ ] text node');
    });

    it('taskList all statuses', () => {
      const taskItems: TaskListNodes = [
        { content: 'complete', status: 'complete' },
        { content: 'pending', status: 'pending' },
        { content: 'in-progress', status: 'in-progress' }
      ];
      const result = taskList(taskItems);
      expect(result).toContain('- [x] complete');
      expect(result).toContain('- [/] in-progress');
      expect(result).toContain('- [ ] pending');
    });
  });

  describe('element', () => {
    const items: ListNodes = [
      { content: 'one' },
      { content: { text: 'Two', styles: { italic: 'i' } } },
      {
        content: { text: 'Three', styles: { bold: 'md' } },
        children: [
          { content: 'child1' },
          { content: { text: 'childLink', styles: { underline: 'u' } } }
        ]
      }
    ];

    it('builds unordered list (default)', () => {
      const ul = listElement({ items });
      expect(ul).toContain('<ul>');
      expect(ul).toContain('<li>one</li>');
      expect(ul).toContain('<li><i>Two</i></li>');
      expect(ul).toContain('<li><u>childLink</u></li>');
      expect(ul).toContain('</ul>');
    });

    it('builds ordered list', () => {
      const ol = listElement({ items, type: 'ordered' });
      expect(ol).toContain('<ol>');
      expect(ol).toContain('<li>one</li>');
      expect(ol).toContain('</ol>');
    });

    it('applies props to outer element', () => {
      const ul = listElement({ items: [{ content: 'x' }], props: { class: 'my-list' } });
      expect(ul).toContain('class="my-list"');
    });
  });
});
