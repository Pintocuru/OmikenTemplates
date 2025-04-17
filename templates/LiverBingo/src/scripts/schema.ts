// src/scripts/schema.ts
import { z } from 'zod';
import { themes } from '@common/DaisyUi/DaisyUiTheme';

// CardSize 型定義（3〜10まで）
export const CardSizeValues = [3, 4, 5, 6, 7, 8, 9, 10] as const;
export type CardSize = (typeof CardSizeValues)[number];

// BingoItem スキーマ
export const BingoItemSchema = z.object({
 id: z.string().default(() => crypto.randomUUID()), // ユニークIDをデフォルトで生成
 title: z.string().default(''),
 weight: z.number().min(0).default(1),
 target: z.number().min(0).default(1),
 unit: z.union([z.literal(1), z.literal(10), z.literal(100), z.literal(1000)]).default(1)
});

// BingoCard スキーマ
export const BingoCardSchema = z.object({
 cardSize: z
  .union([
   z.literal(3),
   z.literal(4),
   z.literal(5),
   z.literal(6),
   z.literal(7),
   z.literal(8),
   z.literal(9),
   z.literal(10)
  ])
  .default(3),
 theme: z.enum(themes).default('light')
});

// BingoConfig スキーマ
export const BingoConfigSchema = z.object({
 bingoSeeds: z.array(BingoItemSchema).default([]),
 bingoRandomSeeds: z.array(BingoItemSchema).default([]),
 bingoCard: BingoCardSchema.default({})
});

// ---

// 型定義
export type BingoItem = z.infer<typeof BingoItemSchema>;
export type BingoCard = z.infer<typeof BingoCardSchema>;
export type BingoConfig = z.infer<typeof BingoConfigSchema>;

// ---

// データ検証とデフォルト値適用のユーティリティ関数
export function validateBingoConfig(input: unknown): BingoConfig {
 return BingoConfigSchema.parse(input);
}
