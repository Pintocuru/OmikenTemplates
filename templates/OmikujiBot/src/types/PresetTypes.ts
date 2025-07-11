// src/types/PresetTypes.ts
// 250709_3更新
// ParameterItem 変更
import { Component } from 'vue';
import { Comment } from '@onecomme.com/onesdk/types/Comment';
import { omikujiData, PostAction, PostActionWordParty } from './OmikujiTypes';

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

// ===== 基本プリセット型 =====

/** おみくじプリセット */
export interface OmikujiPreset extends PresetMetadata {
 item: omikujiData;
}

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
 image: CharacterImageSet;
}

/** キャラクターの色設定 */
export interface CharacterColorScheme {
 nameColor: string; // 名前表示色
 textColor: string; // コメント文字色
 backgroundColor: string; // フキダシの背景色
}

/** キャラクターの画像設定 */
export const CHARACTER_EMOTIONS = {
 DEFAULT: 'default', // 基本
 HAPPY: 'happy', // 喜び
 EXCITED: 'excited', // ワクワク、盛り上がり
 LAUGHING: 'laughing', // 爆笑している
 BLUSHING: 'blushing', // 照れてる・嬉しい
 SURPRISED: 'surprised', // 驚き
 SAD: 'sad', // 悲しみ
 ANGRY: 'angry', // 怒り
 THINKING: 'thinking', // 考え中・困惑
 WINK: 'wink', // 茶目っ気・軽い冗談
 SINGING: 'singing', // 歌ってる
 SLEEPY: 'sleepy' // 眠い・休憩中
} as const;

// 感情ラベルマップ
export const emotionLabels: Record<CharacterEmotion, string> = {
 default: 'デフォルト',
 happy: '喜び',
 excited: 'ワクワク',
 laughing: '爆笑',
 blushing: '照れ',
 surprised: '驚き',
 sad: '悲しみ',
 angry: '怒り',
 thinking: '考え中',
 wink: '茶目っ気',
 singing: '歌',
 sleepy: '眠い'
};

export type CharacterEmotion = (typeof CHARACTER_EMOTIONS)[keyof typeof CHARACTER_EMOTIONS];
export type CharacterImageSet = Record<CharacterEmotion, string>;

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
type DefaultTypes = {
 Settings: Record<string, Serializable>;
 Params: Record<string, Serializable>;
 Placeholders: Record<string, string>;
 Ranking: UserStatistics<Record<string, Serializable>>;
 GameExtras: Record<string, Serializable>;
};

export type Serializable =
 | string
 | number
 | boolean
 | null
 | undefined
 | Serializable[]
 | { [key: string]: Serializable };

export interface ScriptPreset<
 TSettings extends object = DefaultTypes['Settings'],
 TParams extends object = DefaultTypes['Params'],
 TPlaceholders extends object = DefaultTypes['Placeholders'],
 TRanking extends UserStatistics<object> = DefaultTypes['Ranking'],
 TGameExtras extends object = DefaultTypes['GameExtras']
> extends PresetMetadata {
 /** メイン実行クラス */
 execute: ScriptClass<TSettings, TParams, TPlaceholders, TRanking, TGameExtras>;
 /** スクリプトの設定値 */
 settings: ParameterItem<TSettings>[];
 /** 実行時にユーザーが入力するパラメータ */
 params: ParameterItem<TParams>[];
 /** 動的置換用プレースホルダー */
 placeholders: ScriptPlaceholderItem<TPlaceholders>[];
 /** 対応するVueコンポーネント */
 component: Component | null;
}

// ===== スクリプト実行クラス =====

// スクリプトのメイン実行クラス
export interface ScriptClass<
 TSettings extends object = DefaultTypes['Settings'],
 TParams extends object = DefaultTypes['Params'],
 TPlaceholders extends object = DefaultTypes['Placeholders'],
 TRanking extends UserStatistics<object> = DefaultTypes['Ranking'],
 TGameExtras extends object = DefaultTypes['GameExtras']
> {
 /** 初期化処理 */
 setup(settings: TSettings): void;

 /** メイン実行関数 */
 run(comment: Comment, params: TParams): ScriptResult<TPlaceholders, TRanking>;

 /** 外部API呼び出し（オプション） */
 apiCall?(
  gameState: GameState<TGameExtras>,
  method: HttpMethod,
  endpoint: string,
  body?: any,
  headers?: Record<string, string>
 ): Promise<ApiCallResult<TGameExtras>>;

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
export interface ScriptResult<
 TPlaceholders extends object = DefaultTypes['Placeholders'],
 TRanking extends UserStatistics<object> = DefaultTypes['Ranking']
> {
 /** わんコメに投稿するコメント・WordParty */
 postActions: (PostAction | PostActionWordParty)[];

 /** runして出力されたプレースホルダー郡 */
 placeholders: TPlaceholders;

 /** おみくじ結果のリスト */
 rankingList: TRanking[] | null;
}

/**
 * API呼び出しの結果
 */
// API呼び出しの結果
export interface ApiCallResult<TGameExtras extends object = DefaultTypes['GameExtras']> {
 status: 'success' | 'error'; // 実行ステータス
 statusCode?: number; // HTTPステータスコード
 gameState: GameState<TGameExtras>; // ゲームデータ
 message: string; // 結果メッセージ
 data?: any; // レスポンスデータ
 error?: {
  // エラー詳細
  code: string;
  details?: any;
 };
}

// ===== パラメータ関連 =====

/**
 * パラメータの入力タイプ
 */
export type ParameterInputType = 'select' | 'number' | 'string' | 'boolean';

/** パラメータアイテム */
export type ParameterItem<T extends object = DefaultTypes['Params'], K extends keyof T = keyof T> =
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
export interface ScriptPlaceholderItem<T extends object = DefaultTypes['Placeholders']>
 extends BasePresetItem {
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
export type GameState<
 TExtras extends object = DefaultTypes['GameExtras'],
 TUserStats extends object = DefaultTypes['GameExtras']
> = {
 /** 使用中のルールID */
 ruleId: string;
 /** 総おみくじ実行回数 */
 totalDraws: number;
 /** ユーザー別統計情報 */
 userStats: Record<string, UserStatistics<TUserStats>>;
 /** 参加ユーザーの履歴（時系列順） */
 currentUserIds: string[];
} & TExtras;

/**
 * ユーザーの統計情報
 */
export type UserStatistics<TExtras extends object = DefaultTypes['GameExtras']> = {
 /** ユーザーID */
 userId: string;
 /** 表示名 */
 name: string;
 /** このユーザーのおみくじ実行回数 */
 draws: number;
} & TExtras;
