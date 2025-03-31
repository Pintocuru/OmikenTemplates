// src/scripts/schema.ts
import { z } from 'zod';

// テーマのリスト
export const themes = [
 'light',
 'dark',
 'cupcake',
 'bumblebee',
 'emerald',
 'corporate',
 'synthwave',
 'retro',
 'cyberpunk',
 'valentine',
 'halloween',
 'garden',
 'forest',
 'aqua',
 'lofi',
 'pastel',
 'fantasy',
 'wireframe',
 'black',
 'luxury',
 'dracula',
 'cmyk',
 'autumn',
 'business',
 'acid',
 'lemonade',
 'night',
 'coffee',
 'winter',
 'dim',
 'nord',
 'sunset',
 'caramellatte',
 'abyss',
 'silk'
] as const;

// BingoItem スキーマ
export const BingoItemSchema = z.object({
 id: z.string().default(() => crypto.randomUUID()), // ユニークIDをデフォルトで生成
 title: z.string().default(''),
 weight: z.number().min(0).default(1),
 target: z.number().min(0).default(1),
 unit: z.union([z.literal(1), z.literal(10), z.literal(100), z.literal(1000)]).default(1)
});

export type BingoItem = z.infer<typeof BingoItemSchema>;

// BingoCard スキーマ
export const BingoCardSchema = z.object({
 cardSize: z.union([z.literal(3), z.literal(4), z.literal(5)]).default(3),
 theme: z.enum(themes).default('light')
});

export type BingoCard = z.infer<typeof BingoCardSchema>;

// BingoConfig スキーマ
export const BingoConfigSchema = z.object({
 bingoSeeds: z.array(BingoItemSchema).default([]),
 bingoRandomSeeds: z.array(BingoItemSchema).default([]),
 bingoCard: BingoCardSchema.default({})
});

export type BingoConfig = z.infer<typeof BingoConfigSchema>;

// データ検証とデフォルト値適用のユーティリティ関数
export function validateBingoConfig(input: unknown): BingoConfig {
 return BingoConfigSchema.parse(input);
}
