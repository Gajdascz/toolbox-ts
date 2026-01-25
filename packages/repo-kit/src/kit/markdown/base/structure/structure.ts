export const HORIZONTAL_SEPARATOR = '---';
export type HorizontalSeparator = typeof HORIZONTAL_SEPARATOR;

export const end = (text: string, separator = true): string => {
  if (text.length === 0) return '';
  return separator ? `${text}\n\n${HORIZONTAL_SEPARATOR}` : text;
};

export const join = (
  ...parts: (string | undefined)[] | readonly (string | undefined)[]
): string =>
  end(
    parts
      .filter((p): p is string => p !== undefined && p.length > 0)
      .join('\n\n'),
    false
  );

export interface SectionParts {
  body: string;
  separator?: boolean;
  title?: string;
}
export const section = ({ body, title, separator }: SectionParts) =>
  end(join(title, body), separator);
