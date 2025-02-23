// src/types.ts

// 時間に関する正規表現パターン
export const TIME_PATTERNS = {
 absolute:
  /(?:^|[^０-９0-9])([０-９0-9]{1,2})[:：じ時]([０-９0-9]{1,2})(?:[:：分ふん])?(?::?([０-９0-9]{1,2})(?:[秒びょう])?)?/g,
 relative:
  /([０-９0-9]{1,3})(?:分後|ふんご|秒後|びょうご)|(?:in\s+)([0-9]{1,3})\s+(min(?:ute)?s?|sec(?:ond)?s?)/gi
} as const;

// これはなに
export interface TimeParts {
 hours: number;
 minutes: number;
 seconds: number;
}

// これはなに
export type TimeUnit = 'minutes' | 'seconds';
export type ProcessResult = {
 success: boolean;
 error?: string;
 times?: Date[];
};

// 追加configの型定義
export interface CountParty {
 [key: number]: string;
}

export interface NextTimerConfigType {
 ALWAYS_VISIBLE: boolean;
 AFTER_SHOW: number;
 SECOND_ADJUST: number;
 COUNT_PARTY: CountParty;
 COUNT_PARTY_START: string;
 COUNT_PARTY_FINISH: string;
}
