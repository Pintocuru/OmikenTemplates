// src/scripts/schema.ts
import { z } from 'zod';
import { themes } from '@common/DaisyUi/DaisyUiTheme';

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
 cardSize: z.union([z.literal(3), z.literal(4), z.literal(5)]).default(3),
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
