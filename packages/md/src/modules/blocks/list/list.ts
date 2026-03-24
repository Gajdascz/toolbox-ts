import {
  type Text,
  type GithubElementProps,
  makeHtmlElement,
  text,
  isText
} from '../../core/index.js';
import { TAB } from '../../core/index.js';
//#region> List
export type ListType = 'ordered' | 'task' | 'unordered';
export type ListNode = { children?: ListNode[]; content: Text } | Text;
export type ListNodes = ListNode[] | readonly ListNode[];
export type TaskStatus = 'complete' | 'in-progress' | 'pending';
export type TaskListNode = { status: TaskStatus; content: Text; children?: TaskListNode[] } | Text;
export type TaskListNodes = TaskListNode[] | readonly TaskListNode[];

const normalizeListNode = (
  node: ListNode | TaskListNode
): { children: (TaskListNode | ListNode)[]; content: Text; status: TaskStatus } =>
  isText(node)
    ? { content: node, children: [], status: 'pending' }
    : {
        content: node.content,
        children: node.children ?? [],
        status: 'status' in node ? node.status : 'pending'
      };

export type ListOptions = { items: ListNodes };
export const listItem = ({
  content,
  prefix,
  level
}: {
  content: Text;
  prefix: string;
  level: number;
}) => `${TAB.repeat(level)}${prefix} ${text(content)}`;
const UL_PREFIX = '-';
export const unorderedList = (items: ListNodes, level = 0): string =>
  items
    .map((node) => {
      const { children, content } = normalizeListNode(node);
      const line = listItem({ content, prefix: UL_PREFIX, level });
      return children.length === 0 ? line : `${line}\n${unorderedList(children, level + 1)}`;
    })
    .join('\n');

export const orderedList = (items: ListNodes, level = 0): string =>
  items
    .map((node, index) => {
      const { children, content } = normalizeListNode(node);
      const line = listItem({ content, prefix: `${index + 1}.`, level });
      return children.length === 0 ? line : `${line}\n${orderedList(children, level + 1)}`;
    })
    .join('\n');
const TASK_PREFIX: Record<TaskStatus, string> = {
  'in-progress': '- [/]',
  complete: '- [x]',
  pending: '- [ ]'
} as const;
export const taskList = (items: TaskListNodes | ListNodes, level = 0): string =>
  items
    .map((node) => {
      const { children, content, status } = normalizeListNode(node);
      const line = listItem({ content, prefix: TASK_PREFIX[status], level });
      return children.length === 0 ? line : `${line}\n${taskList(children, level + 1)}`;
    })
    .join('\n');

export type ListElementType = Exclude<ListType, 'task'>;
const HTML_LIST_TAG = { unordered: 'ul', ordered: 'ol' } as const;

export interface ListElementOptions {
  items: ListNodes;
  props?: GithubElementProps;
  type?: ListElementType;
}

export const listElement = ({
  items,
  type = 'unordered',
  props = {}
}: ListElementOptions): string =>
  makeHtmlElement(
    HTML_LIST_TAG[type],
    items
      .map((node) => {
        const { children, content } = normalizeListNode(node);
        return makeHtmlElement(
          'li',
          text(content) + (children.length > 0 ? listElement({ items: children, type }) : '')
        );
      })
      .join(''),
    props
  );

//#endregion
