import { type Text, EMOJIS, text } from '../../core/index.js';

export type Callout = `> [!${Uppercase<CalloutType>}]\n> ${string}`;
export interface CalloutOptions {
  message: Text;
  type: CalloutType;
  emoji?: boolean;
}

export type CalloutType = 'caution' | 'important' | 'note' | 'tip' | 'warning';

export const callout = ({ message, type, emoji = true }: CalloutOptions) =>
  `> [!${type.toUpperCase()}]\n> ${
    emoji ? `${EMOJIS[type.toUpperCase() as Uppercase<CalloutType>]} ` : ''
  }${text(message)}` as const;
