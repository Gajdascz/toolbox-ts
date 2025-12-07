import type { StrRecord } from '@toolbox-ts/utils';

import path from 'node:path';

import type {
  Reporter as IReporter,
  ReporterOptions,
  StringifyOptions
} from '../types.js';

/**
 * Adapter function type to convert input items to GitHub Actions annotation messages.
 *
 * @template T - The type of the input item to be adapted.
 */
export type Adapter<T = unknown> = (
  item: T,
  options?: FormatOptions
) => Message;

export interface FormatOptions {
  /** The root directory of the workspace, used for relative paths in annotations. */
  workspaceRoot?: string | undefined;
}

/**
 * Represents a GitHub Actions annotation message.
 */
export interface Message {
  /** Column number in the file where the annotation applies (optional). */
  col?: number;
  /** Absolute or relative path to the file for the annotation (optional). */
  file?: string;
  /** Line number in the file where the annotation applies (optional). */
  line?: number;
  /** The main message to display in the annotation. */
  message: string;
  /** The annotation's title, shown in the GitHub UI. */
  title?: string;
  /** The annotation type: 'debug', 'error', 'notice', or 'warning'. */
  type: NoticeType;
}
/**
 * Represents the type of notice for GitHub Actions annotations.
 * - 'debug': For debugging information.
 * - 'error': For errors that need attention.
 * - 'notice': For general notices or information.
 * - 'warning': For warnings that may require action.
 * @see {@link https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands#about-workflow-commands}
 */
export type NoticeType = 'debug' | 'error' | 'notice' | 'warning';

/**
 * Reporter class to format and output GitHub Actions annotations.
 *
 * @template T - The type of the input item to be reported.
 */
export class Reporter<T = Message> implements IReporter<T[]> {
  static readonly name = 'gh-actions-annotations';
  static noticeTypes = ['debug', 'error', 'notice', 'warning'] as const;
  constructor(private adapter: Adapter<T>) {}

  /**
   * Formats data using the provided adapter to an array
   * of GitHub Actions annotation strings.
   */
  format(items: T | T[], opts: ReporterOptions = {}) {
    const _items = Array.isArray(items) ? items : [items];
    return _items.map((item) => this.buildAnnotation(this.adapter(item, opts)));
  }

  isNoticeType(type: string): type is NoticeType {
    return Reporter.noticeTypes.includes(type as NoticeType);
  }

  /** Parse GitHub Actions annotation string(s) back into Message objects */
  parseAnnotations(annotations: string | string[]): Message[] {
    const _annotations =
      Array.isArray(annotations) ? annotations : [annotations];

    return _annotations.map<Message>((annotation) => {
      const parts = annotation.split('::').filter(Boolean);
      if (parts.length < 2)
        throw new Error(`Invalid annotation string: ${annotation}`);
      const [typeAndFields, message] = parts;
      const [type, fieldsStr] = typeAndFields.split(' ');
      if (!this.isNoticeType(type))
        throw new Error(`Unknown annotation type: ${type}`);
      const fields = fieldsStr
        .split(',')
        .reduce<StrRecord<string>>((acc, field) => {
          const [key, value] = field.split('=');
          if (key && value) {
            acc[key] = decodeURIComponent(value);
          }
          return acc;
        }, {});
      return {
        type,
        message: decodeURIComponent(message),
        col: fields.col ? Number.parseInt(fields.col, 10) : undefined,
        file: fields.file,
        line: fields.line ? Number.parseInt(fields.line, 10) : undefined,
        title: fields.title
      };
    });
  }
  /** Convert to GitHub Actions annotation string */
  stringify(
    items: T | T[],
    { footer, header, ...rest }: StringifyOptions = {}
  ): string {
    let _items = this.format(items, rest).join('\n');
    if (header) _items = `${header}\n${_items}`;
    if (footer) _items = `${_items}\n${footer}`;
    return _items;
  }

  /** Convert to structured JSON string */
  toJson(items: T[], options?: ReporterOptions): string {
    return JSON.stringify(this.toObject(items, options), null, 2);
  }

  /** Group messages by notice type and file */
  toObject(
    items: T[],
    { workspaceRoot, ...rest }: ReporterOptions = {}
  ): Record<NoticeType, Message[]> {
    const wsRoot = this.resolveWorkspaceRoot(workspaceRoot);

    const grouped: Record<NoticeType, Message[]> = {
      error: [],
      warning: [],
      notice: [],
      debug: []
    };

    for (const item of items) {
      const msg = this.adapter(item, { workspaceRoot: wsRoot, ...rest });
      grouped[msg.type].push(
        this.adapter(item, { ...rest, workspaceRoot: wsRoot })
      );
    }

    return grouped;
  }

  /** Resolves a Message object to a proper Github Annotation string.*/
  protected buildAnnotation(
    { col, file, line, message, title, type }: Message,
    options: FormatOptions = {}
  ): string {
    const wsRoot = this.resolveWorkspaceRoot(options.workspaceRoot);
    const fields: string[] = [];

    if (file) {
      const relativeFile = path.relative(wsRoot, file);
      fields.push(`file=${this.escapeValues(relativeFile)}`);
    }
    if (line) fields.push(`line=${this.escapeValues(line.toString())}`);
    if (col) fields.push(`col=${this.escapeValues(col.toString())}`);
    if (title) fields.push(`title=${this.escapeValues(title)}`);
    const fieldsStr = fields.length > 0 ? ' ' + fields.join(',') : '';
    return `::${type}${fieldsStr}::${this.escapeValues(message)}`;
  }
  /**
   * Escapes special characters in a string for use in GitHub Actions annotations.
   * @see {@link https://github.com/actions/toolkit/blob/cee7d92d1d02e3107c9b1387b9690b89096b67be/packages/core/src/command.ts#L92-L105}
   */
  protected escapeValues(value: string): string {
    return value
      .replaceAll('%', '%25')
      .replaceAll('\r', '%0D')
      .replaceAll('\n', '%0A')
      .replaceAll(':', '%3A')
      .replaceAll(',', '%2C');
  }
  private resolveWorkspaceRoot(provided: string | undefined) {
    return provided ?? process.env.GITHUB_WORKSPACE ?? process.cwd();
  }
}
