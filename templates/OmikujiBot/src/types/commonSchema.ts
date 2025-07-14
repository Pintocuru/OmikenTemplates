// src/types/commonSchema.ts
// 250714_1　全編改変
import { z } from 'zod';

// 基本のスキーマ
export const BaseSchema = z.object({
 id: z.string().default('').catch(''),
 name: z.string().default('').catch(''),
 order: z.number().min(0).default(0).catch(0),
 editorColor: z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/)
  .default('#3B82F6')
  .catch('#3B82F6')
});
