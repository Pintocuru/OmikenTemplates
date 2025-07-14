// src/types/ScriptTypes.ts
// 250714_1　全編改変
import { DefineComponent } from 'vue';
import { Comment } from '@onecomme.com/onesdk/types/Comment';

// ===== 共通型定義 =====

interface BasePresetItem {
 id: string; // ID
 name: string; // 名前
 description: string; // 説明
}

// プリセットの共通メタデータ
export interface PresetMetadata extends BasePresetItem {
 version: string; // プリセットのバージョン
 author?: string; // 作成者名
 order?: number; // UI表示時の並び順
 tags: string[]; // 検索タグ
 url?: string; // URL
 banner?: string; // プレビュー画像
 path?: string; // ファイルパス（Presetsディレクトリからの相対）
}

// ===== スクリプトプリセット =====

// デフォルト値
type DefaultTypes = Record<string, Serializable>;
export type Serializable = string | number | boolean;

// スクリプトプリセット
export interface ScriptPreset<
 TSettings extends object = DefaultTypes,
 TParams extends object = DefaultTypes,
 TPlaceholders extends object = DefaultTypes
> extends PresetMetadata {
 execute: ScriptClass<TSettings, TParams, TPlaceholders>; // メイン実行クラス
 settings: ParameterItem<TSettings>[]; // スクリプトの設定値
 params: ParameterItem<TParams>[]; // 実行時にユーザーが入力するパラメータ
 placeholders: ScriptPlaceholderItem<TPlaceholders>[]; // 動的置換用プレースホルダー
 component: ScriptComponentType<TSettings> | null; // 対応するVueコンポーネント
}

// ===== スクリプト実行クラス =====

// スクリプトのメイン実行クラス
export interface ScriptClass<
 TSettings extends object = DefaultTypes,
 TParams extends object = DefaultTypes,
 TPlaceholders extends object = DefaultTypes
> {
 setup(settings: TSettings): void; // 初期化処理
 run(comment: Comment, params: TParams): ScriptResult<TPlaceholders>; // メイン実行関数
 getGameState(): GameState | null; // gameState取得
 cleanup?(gameState: GameState): void; // 終了処理（オプション）
}

// スクリプト実行の結果
export interface ScriptResult<TPlaceholders extends object = DefaultTypes> {
 postActions: (PostAction | PostActionWordParty)[]; // わんコメに投稿するコメント・WordParty
 placeholders: TPlaceholders; // runして出力されたプレースホルダー群
}

// ===== パラメータ関連 =====

// パラメータの入力タイプ
export type ParameterInputType = 'select' | 'number' | 'string' | 'boolean';

// パラメータアイテム
export type ParameterItem<
 T extends object = DefaultTypes,
 K extends keyof T = keyof T
> = BasePresetItem & {
 id: K;
 inputType: ParameterInputType;
 defaultValue: T[K];
 values?: ReadonlyArray<T[K]>;
 min?: number;
 max?: number;
};

// プレースホルダーアイテム
export interface ScriptPlaceholderItem<T extends object = DefaultTypes> extends BasePresetItem {
 id: Extract<keyof T, string>; // プレースホルダーID
 value: string | number; // プレースホルダーの値
}

// ===== ゲーム状態管理 =====

// ゲーム状態 - 拡張可能な設計でゲーム固有のデータを追加できる
export type GameState = {
 ruleId: string; // 使用中のルールID
 totalDraws: number; // 総おみくじ実行回数
 currentUserIds: string[]; // 参加ユーザーの履歴（時系列順）
 userStats: Record<string, UserStatsType>; // ユーザー別統計情報
 userRecords?: Record<string, UserStatsType[]>; // ポイントモード用の複数記録
 userRankings?: UserStatsType[]; // ランキング
};

// ユーザーの統計情報
export type UserStatsType = {
 userId: string; // ユーザーID
 name: string; // 表示名
 draws: number; // このユーザーのおみくじ実行回数
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
export type ScriptComponentPropsType<T extends object = DefaultTypes> = {
 settings: T;
 userRankings: UserStatsType[];
 displaySize: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
};

export type ScriptComponentType<T extends object = DefaultTypes> = DefineComponent<
 ScriptComponentPropsType<T>
>;

// ===== アクション関連 =====

// OmikujiSchema.ts より
export type PostAction = {
 characterKey: string; // キャラクターキー
 iconKey: string; // アイコンキー
 delaySeconds: number; // 投稿までの遅延時間（秒）
 wordParty: string; // 発動させるWordParty
 messageContent: string; // わんコメに投稿するメッセージ
 messageToast: string; // このジェネレーターで表示させるトースト
};

// wordParty用
export type PostActionWordParty = Pick<PostAction, 'delaySeconds' | 'wordParty'>;
