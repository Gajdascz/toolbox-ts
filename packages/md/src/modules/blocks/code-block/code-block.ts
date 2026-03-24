export type CodeBlock = `\`\`\`${CodeBlockLanguage}\n${string}\n\`\`\``;
export type CodeBlockLanguage =
  | 'astro'
  | 'bash'
  | 'css'
  | 'html'
  | 'javascript'
  | 'js'
  | 'json'
  | 'jsx'
  | 'plaintext'
  | 'sh'
  | 'shell'
  | 'ts'
  | 'tsx'
  | 'typescript'
  | 'xml'
  | 'yaml'
  | 'yml';
export const codeBlock = (code: string, language: CodeBlockLanguage = 'plaintext'): CodeBlock =>
  `\`\`\`${language}\n${code}\n\`\`\``;
