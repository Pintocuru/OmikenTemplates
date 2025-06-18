// src/types/PresetTypes.ts
import { Comment } from '@onecomme.com/onesdk/types/Comment';
import { OmikujiData, PostAction, PostActionWordParty } from './OmikujiTypes';

// ===== 共通型定義 =====

/**
 * 全てのプリセット項目の基底インターフェース
 * 共通の識別情報とメタデータを含む
 */
export interface BasePresetItem {
 /** 一意識別子 */
 id: string;
 /** 人間が読める名前 */
 name: string;
 /** 機能の説明 */
 description: string;
}

/**
 * プリセットの共通メタデータ
 * 配布・管理に必要な情報を含む
 */
export interface PresetMetadata extends BasePresetItem {
 /** セマンティックバージョン (例: "1.0.0") */
 version: string;
 /** 作成者名 */
 author?: string;
 /** UI表示時の並び順 */
 order?: number;
 /** 検索・分類用タグ */
 tags: string[];
 /** サポート・ドキュメントURL */
 url?: string;
 /** プレビュー画像URL */
 banner?: string;
 /** ファイルシステム上のパス（Presetsディレクトリからの相対パス） */
 path?: string;
}

// ===== スクリプト関連のデフォルト型 =====

/** スクリプト設定のデフォルト型 */
export type DefaultSettings = Record<string, any>;

/** 実行時パラメータのデフォルト型 */
export type DefaultParams = Record<string, any>;

/** プレースホルダーのデフォルト型 */
export type DefaultPlaceholders = Record<string, string>;

/** ゲーム拡張データのデフォルト型 */
export type DefaultGameExtras = Record<string, any>;

// ===== 基本プリセット型 =====

/**
 * おみくじプリセット
 * おみくじデータと統合オプションを含む
 */
export interface OmikujiPreset extends PresetMetadata {
 /** おみくじの具体的なデータ */
 item: OmikujiData;
 /** 既存データとの統合方法 */
 isOverwrite?: boolean; // true: 既存を上書き, false: 既存に追加
}

/**
 * キャラクター表示プリセット
 * コメント投稿者の見た目をカスタマイズ
 */
export interface CharacterPreset extends PresetMetadata {
 /** アイコン表示の有無 */
 isIconDisplay: boolean;
 /** 音声読み上げ時の名前（ひらがな等） */
 displayName?: string;
 /** わんコメの枠ID（nullの場合はコメントテスターでの投稿） */
 frameId: string | null;
 /** 表示色設定 */
 color: CharacterColorScheme;
 /** 状態別画像セット */
 image: CharacterImageSet;
}

/**
 * キャラクターの色設定
 */
export interface CharacterColorScheme {
 nameColor: string; // 名前表示色
 textColor: string; // コメント文字色
 backgroundColor: string; // フキダシの背景色
}

/**
 * キャラクターの画像設定
 * Defaultは必須、その他の状態画像は任意
 */
export type CharacterImageSet = {
 default: string;
} & Partial<Record<CharacterEmotion, string>>;

export type CharacterEmotion =
 | 'happy' // 喜び
 | 'excited' // ワクワク、盛り上がり
 | 'laughing' // 爆笑している
 | 'blushing' // 照れてる・嬉しい
 | 'surprised' // 驚き
 | 'sad' // 悲しみ
 | 'angry' // 怒り
 | 'thinking' // 考え中・困惑
 | 'wink' // 茶目っ気・軽い冗談
 | 'singing' // 歌ってる
 | 'sleepy'; // 眠い・休憩中

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
export interface ScriptPreset<
 TSettings extends DefaultSettings = DefaultSettings,
 TParams extends DefaultParams = DefaultParams,
 TPlaceholders extends DefaultPlaceholders = DefaultPlaceholders,
 TGameExtras extends DefaultGameExtras = DefaultGameExtras
> extends PresetMetadata {
 /** メイン実行クラス */
 execute: ScriptClass<TSettings, TParams, TPlaceholders, TGameExtras>;
 /** スクリプトの設定値 */
 settings: ParameterItem<TSettings>[];
 /** 実行時にユーザーが入力するパラメータ */
 params: ParameterItem<TParams>[];
 /** 動的置換用プレースホルダー */
 placeholders: ScriptPlaceholderItem<TPlaceholders>[];
 /** API設定（apiCallメソッドを使用する場合） */
 apiConfig?: ApiConfig;
}

/**
 * API設定
 */
export interface ApiConfig {
 baseURL: string;
 timeout?: number;
 defaultHeaders?: Record<string, string>;
 retryCount?: number;
}

// ===== スクリプト実行クラス =====

/**
 * スクリプトのメイン実行クラス
 * コメント受信時に呼び出される
 *
 * @template TSettings - 設定値の型
 * @template TParams - 実行時パラメータの型
 * @template TPlaceholders - プレースホルダーの型
 * @template TGameExtras - ゲーム固有データの型
 */
export interface ScriptClass<
 TSettings extends DefaultSettings = DefaultSettings,
 TParams extends DefaultParams = DefaultParams,
 TPlaceholders extends DefaultPlaceholders = DefaultPlaceholders,
 TGameExtras extends DefaultGameExtras = DefaultGameExtras
> {
 /**
  * 初期化処理（オプション）
  * スクリプト開始時に一度だけ実行される
  */
 setup(settings: TSettings): Promise<void> | void;

 /**
  * メイン実行関数
  * コメント受信時に呼び出される
  */
 run(comment: Comment, params: TParams): ScriptResult<TPlaceholders>;

 /**
  * 外部API呼び出し関数（オプション）
  * クラス内でREST APIを呼び出す場合に実装
  */
 apiCall?(
  gameState: GameState<TGameExtras>,
  method: HttpMethod,
  endpoint: string,
  body?: any,
  headers?: Record<string, string>
 ): Promise<ApiCallResult<TGameExtras>>;

 /**
  * 終了処理（オプション）
  * スクリプト終了時に実行される
  */
 cleanup?(gameState: GameState<TGameExtras>): Promise<void> | void;
}

/**
 * HTTP メソッドの型定義
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

/**
 * スクリプト実行の結果
 */
export interface ScriptResult<TPlaceholders extends DefaultPlaceholders = DefaultPlaceholders> {
 /** わんコメに投稿するコメント・WordParty */
 postActions: PostAction[] | PostActionWordParty[];
 /** runして出力されたプレースホルダー郡 */
 placeholders: TPlaceholders;
}

/**
 * API呼び出しの結果
 */
export interface ApiCallResult<TGameExtras extends DefaultGameExtras = DefaultGameExtras> {
 /** 実行ステータス */
 status: 'success' | 'error';
 /** HTTPステータスコード */
 statusCode?: number;
 /** 更新されたゲーム状態 */
 gameState: GameState<TGameExtras>;
 /** 結果メッセージ */
 message: string;
 /** レスポンスデータ */
 data?: any;
 /** エラー詳細（status が 'error' の場合） */
 error?: {
  code: string;
  details?: any;
 };
}

// ===== パラメータ関連 =====

/**
 * パラメータの入力タイプ
 */
export type ParameterInputType = 'select' | 'number' | 'string' | 'boolean';

/**
 * パラメータアイテム
 *
 * @template T - パラメータ設定全体の型
 */
export interface ParameterItem<T extends Record<string, any> = Record<string, any>>
 extends BasePresetItem {
 /** パラメータのキー */
 id: Extract<keyof T, string>;
 /** 入力タイプ */
 inputType: ParameterInputType;
 /** デフォルト値 */
 defaultValue: T[Extract<keyof T, string>];
 /** 選択肢（select型の場合） */
 values?: readonly T[Extract<keyof T, string>][];
 /** 最小値（number型の場合） */
 min?: number;
 /** 最大値（number型の場合） */
 max?: number;
}

/**
 * プレースホルダーアイテム
 *
 * @template T - プレースホルダー設定全体の型
 */
export interface ScriptPlaceholderItem<T extends DefaultPlaceholders = DefaultPlaceholders>
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
export type GameState<TExtras extends DefaultGameExtras = DefaultGameExtras> = {
 /** 使用中のルールID */
 ruleId: string;
 /** 総おみくじ実行回数 */
 totalDraws: number;
 /** ユーザー別統計情報 */
 userStats: Record<string, UserStatistics>;
 /** 参加ユーザーの履歴（時系列順） */
 currentUserIds: string[];
} & TExtras;

/**
 * ユーザーの統計情報
 */
export interface UserStatistics {
 /** ユーザーID */
 userId: string;
 /** 表示名 */
 name?: string;
 /** このユーザーのおみくじ実行回数 */
 draws: number;
 /** 勝利回数（ゲームに勝利システムがある場合） */
 wins?: number;
 /** 獲得ポイント */
 points?: number;
 /** ユーザーの現在状態（ゲーム固有） */
 status?: string;
 /** 最終参加日時（ISO 8601形式） */
 lastPlayed?: string;
}

// ===== 便利な型エイリアス =====

/**
 * 基本的なスクリプトプリセット（設定なし）
 */
export type SimpleScriptPreset = ScriptPreset<{}, {}, {}, {}>;

/**
 * 設定可能なスクリプトプリセット
 */
export type ConfigurableScriptPreset<
 TSettings extends DefaultSettings = DefaultSettings,
 TGameExtras extends DefaultGameExtras = DefaultGameExtras
> = ScriptPreset<TSettings, {}, {}, TGameExtras>;

/**
 * 全機能スクリプトプリセット
 */
export type FullScriptPreset<
 TSettings extends DefaultSettings = DefaultSettings,
 TParams extends DefaultParams = DefaultParams,
 TPlaceholders extends DefaultPlaceholders = DefaultPlaceholders,
 TGameExtras extends DefaultGameExtras = DefaultGameExtras
> = ScriptPreset<TSettings, TParams, TPlaceholders, TGameExtras>;

// ===== 統合型 =====

/**
 * 全てのプリセット型の統合
 */
export type AnyPreset = OmikujiPreset | CharacterPreset | ScriptPreset<any, any, any, any>;
