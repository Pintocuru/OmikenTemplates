// src/types/OmikujiTypes.ts
import { CommentThreshold } from './OmikujiThresholdTypes';

// =============================================================================
// メインデータ構造
// =============================================================================

export type omikujiData = {
 comments: Record<string, CommentRule>; // コメントベースの抽選ルール
 timers: Record<string, TimerRule>; // 自動で投稿するの抽選ルール
 placeholders: Record<string, PlaceholderSource>; // プレースホルダー
 scriptSettings: Record<string, Record<string, any>>; // scriptSettings
};

// =============================================================================
// ルール関連の型
// =============================================================================

/** ルールカテゴリの定数定義 */
export const RULE_CATEGORIES = ['comments', 'timers'] as const;
export type RuleCategory = (typeof RULE_CATEGORIES)[number];

/** すべてのルールに共通する基本構造 */
type BaseRuleCommon = {
 id: string;
 name: string;
 description: string;
 isEnabled: boolean;
 order: number;
 editorColor: string;
};

type BaseRule =
 | (BaseRuleCommon & { scriptId: string; scriptParams: Record<string, any> })
 | (BaseRuleCommon & { scriptId: null; scriptParams: null });

/** コメント条件によるおみくじ抽選ルール */
export type CommentRule = BaseRule & {
 ruleType: 'comments';
 threshold: CommentThreshold;
 omikuji: OmikujiSet[];
};

/** 時間条件によるおみくじ抽選ルール */
export type TimerRule = BaseRule & {
 ruleType: 'timers';
 intervalSeconds: number;
 omikuji: OmikujiSet[];
};

/** ルールカテゴリから対応する型へのマッピング */
export type RuleTypeMap = {
 comments: CommentRule;
 timers: TimerRule;
};

// =============================================================================
// おみくじ関連の型
// =============================================================================

export type OmikujiSet = {
 name: string; // 表示名
 description: string;
 weight: number; // 出現割合
 placeholderIds: string[]; // プレースホルダーのID
 postActions: PostAction[]; // わんコメへの投稿
};

/**
 * わんコメへの単一投稿アクション
 * おみくじ結果の一部として実行される具体的な動作
 */
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

// =============================================================================
// プレースホルダー関連の型（循環参照による複雑な分岐を実現）
// =============================================================================

/**
 * プレースホルダー定義
 * 一度だけの循環参照を許可することで、複雑な条件分岐や動的な値生成を実現
 */
export type PlaceholderSource = {
 id: string;
 name: string;
 description: string;
 placeholderIds: string[]; // プレースホルダーのID
 values: PlaceholderSourceValue[];
};

/**
 * プレースホルダーの値候補
 */
export type PlaceholderSourceValue = {
 weight: number; // 出現割合
 content: string; // 内容(他のプレースホルダーへの参照可能: <<place_name>>）
};

// Script用プレースホルダー(ミニタイプ)
export type Placeholder = {
 id: string;
 value: string;
};

// =============================================================================
// カテゴリ関連のユーティリティ型
// =============================================================================

export type OmikujiCategory = RuleCategory | 'placeholders';

export type CategoryDataMap = {
 comments: CommentRule;
 timers: TimerRule;
 placeholders: PlaceholderSource;
};

export type GetCategoryData<T extends OmikujiCategory> = CategoryDataMap[T];

// =============================================================================
// 型ガード関数（ランタイムでの型判定用）
// =============================================================================

export function isCommentRule(rule: BaseRule): rule is CommentRule {
 return (rule as CommentRule).ruleType === 'comments';
}

export function isTimerRule(rule: BaseRule): rule is TimerRule {
 return (rule as TimerRule).ruleType === 'timers';
}
