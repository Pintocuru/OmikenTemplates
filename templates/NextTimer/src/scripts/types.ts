// src/types.ts

// 時間に関する正規表現パターン
export const TIME_PATTERN =
 /(?:^|[^０-９0-9])([０-９0-9]{1,2})[:：じ時]([０-９0-9]{1,2})(?:[:：分ふん])?(?::?([０-９0-9]{1,2})(?:[秒びょう])?)?/g;

// コントローラーのアクション定義
export type TimerAction = 'start' | 'pause' | 'reset' | 'toggle_visibility';

// コントローラーの型定義
export interface TimerStorageData {
 action: TimerAction;
 timestamp?: string;
}

// 時間を時間・分・秒で分解する
export interface TimeParts {
 hours: number;
 minutes: number;
 seconds: number;
}

// 追加configの型定義
export interface NextTimerConfigType {
 ALWAYS_VISIBLE: boolean;
 AFTER_SHOW: number;
 SECOND_ADJUST: number;
 COUNT_PARTY: Record<number, string>;
 COUNT_PARTY_START: string;
 COUNT_PARTY_FINISH: string;
}
