// src/types.ts

export interface TimeParts {
 hours: number;
 minutes: number;
 seconds: number;
}

export type TimeUnit = 'minutes' | 'seconds';
export type ProcessResult = {
 success: boolean;
 error?: string;
 time?: Date;
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
