// src/types/PresetTypes.ts
// 250714_1 Zodを前提にするように変更
import { z } from 'zod';
import { DefineComponent } from 'vue';
import { Comment } from '@onecomme.com/onesdk/types/Comment';
import { PostAction, PostActionWordParty } from './OmikujiTypes';

// ===== 共通型定義 =====

/**
 * 全てのプリセット項目の基底インターフェース
 * 共通の識別情報とメタデータを含む
 */
export interface BasePresetItem {
 id: string; // ID
 name: string; // 名前
 description: string; // 説明
}

// 基本のスキーマ
export const BaseSchema = z.object({
 id: z.string().default('').catch(''),
 name: z.string().default('').catch(''),
 description: z.string().default('').catch(''),
 isEnabled: z.boolean().default(true).catch(true),
 order: z.number().min(0).default(0).catch(0),
 editorColor: z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/)
  .default('#3B82F6')
  .catch('#3B82F6')
});

/**
 * プリセットの共通メタデータ
 * 配布・管理に必要な情報を含む
 */
export interface PresetMetadata extends BasePresetItem {
 version: string; // プリセットのバージョン
 author?: string; // 作成者名
 order?: number; // UI表示時の並び順
 tags: string[]; // 検索タグ
 url?: string; // URL
 banner?: string; // プレビュー画像
 path?: string; // ファイルパス（Presetsディレクトリからの相対）
}

// ======================
// Character関連のスキーマ
// ======================
/** キャラクター表示プリセット */
export interface CharacterPreset extends PresetMetadata {
 /** アイコン表示の有無 */
 isIconDisplay: boolean;
 /** 音声読み上げ時の名前（ひらがな等） */
 displayName?: string;
 /** わんコメの枠ID（nullの場合はデフォルト） */
 frameId: string | null;
 /** 表示色設定 */
 color: CharacterColorScheme;
 /** 状態別画像セット */
 image: Record<CharacterEmotion, string>;
}

/** キャラクターの色設定 */
export interface CharacterColorScheme {
 nameColor: string; // 名前表示色
 textColor: string; // コメント文字色
 backgroundColor: string; // フキダシの背景色
}

/** キャラクターの画像設定 */
export const characterEmotions = [
 'default', // 基本
 'happy', // 喜び
 'excited', // ワクワク、盛り上がり
 'laughing', // 爆笑している
 'blushing', // 照れてる・嬉しい
 'surprised', // 驚き
 'sad', // 悲しみ
 'angry', // 怒り
 'thinking', // 考え中・困惑
 'wink', // 茶目っ気・軽い冗談
 'singing', // 歌ってる
 'sleepy' // 眠い・休憩中
] as const;
export type CharacterEmotion = (typeof characterEmotions)[number];
export const CharacterEmotionSchema = z.enum(characterEmotions);

// 感情ラベルマップ
export const emotionLabels: Record<CharacterEmotion, string> = {
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

export const CharacterColorSchemeSchema = z.object({
 nameColor: z.string().default('#000000').catch('#000000'),
 textColor: z.string().default('#000000').catch('#000000'),
 backgroundColor: z.string().default('#FFFFFF').catch('#FFFFFF')
});

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

export const CharacterPresetSchema = z.object({
 ...BaseSchema.shape,
 version: z.string().default('1.0.0').catch('1.0.0'),
 author: z.string().default('').catch(''),
 tags: z.array(z.string().default('').catch('')).default([]).catch([]),
 url: z.string().default('').catch(''),
 path: z.string().default('').catch(''),
 isIconDisplay: z.boolean().default(true).catch(true),
 displayName: z.string().default('').catch(''),
 frameId: z.union([z.string(), z.null()]).default(null).catch(null),
 color: CharacterColorSchemeSchema,
 image: CharacterImageSetSchema
});
export type CharacterImageType = z.infer<typeof CharacterImageSetSchema>;
export type CharacterPresetType = z.infer<typeof CharacterPresetSchema>;

// ===== スクリプトプリセット =====

/**
 * カスタムスクリプトプリセット
 * JavaScriptによる高度なカスタマイズ機能
 *
 * @template TSettings - スクリプトの設定値の型（デフォルト: Record<string, string | number>）
 * @template TParams - 実行時パラメータの型（デフォルト: Record<string, string | number>）
 * @template TPlaceholders - プレースホルダーの型（デフォルト: Record<string, string>）
 * @template TGameExtras - ゲーム固有データの型（デフォルト: Record<string, any>）
 */
type DefaultTypes = Record<string, Serializable>;

export type Serializable = string | number | boolean | null | undefined;

export interface ScriptPreset<
 TSettings extends object = DefaultTypes,
 TParams extends object = DefaultTypes,
 TPlaceholders extends object = DefaultTypes,
 TGameExtras extends object = DefaultTypes
> extends PresetMetadata {
 /** メイン実行クラス */
 execute: ScriptClass<TSettings, TParams, TPlaceholders, TGameExtras>;
 /** スクリプトの設定値 */
 settings: ParameterItem<TSettings>[];
 /** 実行時にユーザーが入力するパラメータ */
 params: ParameterItem<TParams>[];
 /** 動的置換用プレースホルダー */
 placeholders: ScriptPlaceholderItem<TPlaceholders>[];
 /** 対応するVueコンポーネント */
 component: ScriptComponentType<TSettings> | null;
}

// ===== スクリプト実行クラス =====

// スクリプトのメイン実行クラス
export interface ScriptClass<
 TSettings extends object = DefaultTypes,
 TParams extends object = DefaultTypes,
 TPlaceholders extends object = DefaultTypes,
 TGameExtras extends object = DefaultTypes
> {
 /** 初期化処理 */
 setup(settings: TSettings): void;

 /** メイン実行関数 */
 run(comment: Comment, params: TParams): ScriptResult<TPlaceholders>;

 /** gameState取得する */
 getGameState(): GameState<TGameExtras> | null;

 /** 終了処理（オプション） */
 cleanup?(gameState: GameState<TGameExtras>): void;
}

/**
 * HTTP メソッドの型定義
 */
export const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE'] as const;
export type HttpMethod = (typeof HTTP_METHODS)[number];

/**
 * スクリプト実行の結果
 */
export interface ScriptResult<TPlaceholders extends object = DefaultTypes> {
 /** わんコメに投稿するコメント・WordParty */
 postActions: (PostAction | PostActionWordParty)[];

 /** runして出力されたプレースホルダー郡 */
 placeholders: TPlaceholders;
}

// ===== パラメータ関連 =====

/**
 * パラメータの入力タイプ
 */
export type ParameterInputType = 'select' | 'number' | 'string' | 'boolean';

/** パラメータアイテム */
export type ParameterItem<T extends object = DefaultTypes, K extends keyof T = keyof T> =
 | ({
    id: K;
    inputType: 'select';
    values: readonly T[K][];
    defaultValue: T[K];
   } & BasePresetItem)
 | ({
    id: K;
    inputType: 'number';
    defaultValue: T[K];
    min?: number;
    max?: number;
   } & BasePresetItem)
 | ({
    id: K;
    inputType: 'string';
    defaultValue: T[K];
   } & BasePresetItem)
 | ({
    id: K;
    inputType: 'boolean';
    defaultValue: T[K];
   } & BasePresetItem);

/**
 * プレースホルダーアイテム
 *
 * @template T - プレースホルダー設定全体の型
 */
export interface ScriptPlaceholderItem<T extends object = DefaultTypes> extends BasePresetItem {
 /** プレースホルダーID */
 id: Extract<keyof T, string>;
 /** プレースホルダーの値 */
 value: string;
}

// ===== ゲーム状態管理 =====

/**
 * ゲーム状態
 * 拡張可能な設計でゲーム固有のデータを追加できる
 *
 * @template TExtras - ゲーム固有データの型
 */
export type GameState<TExtras extends object = DefaultTypes> = {
 /** 使用中のルールID */
 ruleId: string;
 /** 総おみくじ実行回数 */
 totalDraws: number;
 /** 参加ユーザーの履歴（時系列順） */
 currentUserIds: string[];
 /** ユーザー別統計情報 */
 userStats: Record<string, UserStatistics>;
 // ランキング
 userRankings?: UserStatistics[];
} & TExtras;

/**
 * ユーザーの統計情報
 */
export type UserStatistics = {
 /** ユーザーID */
 userId: string;
 /** 表示名 */
 name: string;
 /** このユーザーのおみくじ実行回数 */
 draws: number;

 // 文字列で表現するランキング用の表示項目（UI向け）
 itemValue1?: string;
 itemValue2?: string;
 itemValue3?: string;
 priority?: number; // 表示の優先度

 // 数値ベースの統計値（ロジック・ソート・分析向け）
 wins?: number; // 勝利回数
 points?: number; // 今回獲得ポイント
 totalPoints?: number; // 総獲得ポイント
 rank?: number; // 順位
 rate?: number; // 勝率（例：0.75なら75%）
};

// props型定義付き
export type ScriptComponentType<T extends object = DefaultTypes> = DefineComponent<{
 settings: T;
 userRankings: UserStatistics[];
 displaySize: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}>;
