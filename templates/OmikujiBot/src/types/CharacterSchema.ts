// src/types/CharacterSchema.ts
// 250714_1　全編改変
import { z } from 'zod';
import { BaseSchema } from './commonSchema';

/**
 * 各種 Threshold
 */

/** キャラクターの画像設定 */
export const characterEmotions = [
 'default', // 基本
 'happy', // 喜び
 'excited', // ワクワク
 'laughing', // 笑い
 'blushing', // 照れ
 'surprised', // 驚き
 'sad', // 悲しみ
 'angry', // 怒り
 'thinking', // 考え中
 'wink', // 茶目っ気
 'singing', // 歌
 'sleepy' // 眠い
] as const;
export type CharacterEmotionType = (typeof characterEmotions)[number];
export const CharacterEmotionSchema = z.enum(characterEmotions);

// 感情ラベルマップ
export const emotionLabels: Record<CharacterEmotionType, string> = {
 default: 'デフォルト',
 happy: '嬉しい',
 excited: 'ワクワク',
 laughing: '笑い',
 blushing: '照れ',
 surprised: '驚き',
 sad: '悲しみ',
 angry: '怒り',
 thinking: '考え中',
 wink: '茶目っ気',
 singing: '歌',
 sleepy: '眠い'
};

export const CharacterColorScheme = z.object({
 nameColor: z.string().default('#000000').catch('#000000'),
 textColor: z.string().default('#000000').catch('#000000'),
 backgroundColor: z.string().default('#FFFFFF').catch('#FFFFFF')
});
export type CharacterColorType = z.infer<typeof CharacterColorScheme>;

export const CharacterImageSetSchema = z.object({
 default: z.string().default('').catch(''),
 happy: z.string().default('').catch(''),
 excited: z.string().default('').catch(''),
 laughing: z.string().default('').catch(''),
 blushing: z.string().default('').catch(''),
 surprised: z.string().default('').catch(''),
 sad: z.string().default('').catch(''),
 angry: z.string().default('').catch(''),
 thinking: z.string().default('').catch(''),
 wink: z.string().default('').catch(''),
 singing: z.string().default('').catch(''),
 sleepy: z.string().default('').catch('')
});
export type CharacterImageType = z.infer<typeof CharacterImageSetSchema>;

/**
 * CharacterSchema
 */
export const CharacterSchema = z.object({
 ...BaseSchema.shape,
 description: z.string().default('').catch(''),
 version: z.string().default('1.0.0').catch('1.0.0'),
 author: z.string().default('').catch(''),
 tags: z.array(z.string().default('').catch('')).default([]).catch([]),
 url: z.string().default('').catch(''),
 path: z.string().default('').catch(''),
 isIconDisplay: z.boolean().default(true).catch(true),
 displayName: z.string().default('').catch(''),
 frameId: z.union([z.string(), z.null()]).default(null).catch(null),
 color: CharacterColorScheme,
 image: CharacterImageSetSchema
});
export type CharacterType = z.infer<typeof CharacterSchema>;
