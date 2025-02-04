// src/Modules/core/ErrorHandler.ts
import { postSystemMessage } from './PostOneComme';

type ErrorLevel = 'info' | 'warn' | 'error';
export function systemMessage(level: ErrorLevel, message: string, error?: unknown): void {
 const errorMessage = `${message}${error ? `: ${String(error)}` : ''}`;
 console[level](errorMessage);

 // メッセージをわんコメに送信
 postSystemMessage(message, level);
}
