// src/types/DisplaySettingsSchema.ts
// 250716_1 新規追加
import { z } from 'zod';
import { ScriptGameKey, scriptGameKeys } from '@/ScriptGame/ScriptGameMap';

// displaySize
export const displaySize = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
export type DisplaySize = (typeof displaySize)[number];
export const displaySizeLabels: Record<DisplaySize, string> = {
 xs: 'XS (極小)',
 sm: 'SM (小)',
 md: 'MD (中)',
 lg: 'LG (大)',
 xl: 'XL (特大)'
};

// DisplayMode
export const displayMode = ['messages', 'userVisits', 'scriptGame'] as const;
export type DisplayMode = (typeof displayMode)[number];
export const displayModeLabels: Record<DisplayMode, string> = {
 messages: 'BOTちゃん',
 userVisits: 'ユーザー訪問履歴',
 scriptGame: 'スクリプトゲーム'
};

// DisplaySettingsSchema
// BOTの表示部分に関わる設定
export const DisplaySettingsSchema = z.object({
 // 文字・画像の大きさ指定
 displaySize: z.enum(displaySize).default('md').catch('md'),
 // 起動時表示するモード
 defaultMode: z
  .object({
   type: z.enum(displayMode).catch('messages'),
   scriptKey: z.enum(scriptGameKeys as [ScriptGameKey, ...ScriptGameKey[]]).catch(scriptGameKeys[0])
  })
  .default({
   type: 'messages',
   scriptKey: scriptGameKeys[0]
  }),
 // 切り替えモードでの表示ON/OFF
 enabledModes: z
  .object({
   messages: z.boolean().default(true),
   userVisits: z.boolean().default(true),
   scriptGames: z
    .object(Object.fromEntries(scriptGameKeys.map((key) => [key, z.boolean().default(true)])))
    .default({})
    .catch({})
  })
  .default({}),
 // キャラクターコントロールパネルを表示しないか
 modeSwitchEnabled: z.boolean().default(true).catch(true),
 // トーストを表示するか
 toastEnabled: z.boolean().default(true).catch(true),
 // モードの自動切り替えをする秒数
 autoSwitchInterval: z.number().min(0).default(0).catch(0)
});
