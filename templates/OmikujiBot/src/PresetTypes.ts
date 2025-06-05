// src/types/PresetTypes.ts
import { Comment } from '@onecomme.com/onesdk/types/Comment';
import { OmikujiData, PostAction } from './OmikujiTypes';

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

// ===== 具体的なプリセット型 =====

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
 /** わんコメの枠ID（nullの場合はデフォルト） */
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
export interface CharacterImageSet {
 /** デフォルト画像（必須） */
 Default: string;
 /** その他の状態画像（例: "happy", "sad", "angry"など） */
 [emotionState: string]: string;
}

/**
 * カスタムスクリプトプリセット
 * JavaScriptによる高度なカスタマイズ機能
 */
export interface ScriptPreset extends PresetMetadata {
 /** メイン実行関数 */
 func: ScriptFunction;
 /** 外部API呼び出し関数（オプション） */
 ApiCall?: ApiCallFunction;
 /** スクリプトの設定値 */
 settings: ScriptParameterSet;
 /** 実行時にユーザーが入力するパラメータ */
 params: ScriptParameterSet;
 /** 動的置換用プレースホルダー */
 placeholders: ScriptPlaceholderSet;
}

// ===== スクリプト関連の型 =====

/**
 * スクリプトのメイン実行関数
 * コメント受信時に呼び出される
 */
export type ScriptFunction<TParams = Record<string, ScriptValue>> = (
 /** 現在のゲーム状態 */
 gameState: GameState,
 /** 受信したコメント */
 comment: Comment,
 /** 実行時パラメータ */
 params: TParams
) => ScriptResult;

/**
 * スクリプト実行の結果
 */
export interface ScriptResult<TPlaceholders = Record<string, string>> {
 /** 実行すべきアクション群 */
 postActions: PostAction[];
 /** 次回実行時に使用するプレースホルダー */
 placeholders: TPlaceholders;
 /** 更新されたゲーム状態 */
 gameState: GameState;
}

/**
 * 外部API呼び出し関数
 */
export type ApiCallFunction = (
 /** 現在のゲーム状態（初回はnull） */
 gameState: GameState | null,
 /** HTTPメソッド */
 method: 'GET' | 'POST' | 'PUT' | 'DELETE',
 /** リクエストボディ */
 body?: any
) => Promise<ApiCallResult>;

/**
 * API呼び出しの結果
 */
export interface ApiCallResult {
 /** 実行ステータス */
 status: 'success' | 'error';
 /** 更新されたゲーム状態 */
 gameState: GameState;
 /** 結果メッセージ */
 message: string;
 /** 追加データ */
 data?: any;
}

/**
 * スクリプトパラメータセット
 * 設定値や実行時パラメータの管理
 */
export interface ScriptParameterSet<TValues = Record<string, ScriptValue>> extends BasePresetItem {
 /** パラメータの値 */
 values: TValues;
}

/**
 * プレースホルダーセット
 * 使用可能な文字列置換
 */
export interface ScriptPlaceholderSet<TValues = Record<string, string>> extends BasePresetItem {
 /** プレースホルダーの値 */
 values: TValues;
}

/**
 * スクリプトで使用可能な値の型
 */
export type ScriptValue = string | number | boolean;

// ===== ゲーム状態管理 =====

/**
 * おみくじゲームの状態
 * 拡張可能な設計でゲーム固有のデータを追加できる
 */
export type GameState<TExtras extends Record<string, any> = {}> = {
 /** 使用中のルールID */
 ruleId: string;
 /** ゲーム設定 */
 settings: ScriptParameterSet;
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
