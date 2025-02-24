// src/types.ts

// 時間に関する正規表現パターン
export const TIME_PATTERN =
 /(?:^|[^０-９0-9])([０-９0-9]{1,2})[:：じ時]([０-９0-9]{1,2})(?:[:：分ふん])?(?::?([０-９0-9]{1,2})(?:[秒びょう])?)?/g;

// reactiveの型定義
export interface TimerState {
 isVisible: boolean; // 表示/非表示
 initialTime: number; // タイマーの初期値
 secondAdjust: SecondAdjustType; // 秒数を丸める単位
 displayTime: string; // カウントが0になる時刻
 countdown: number; // 残り時間(秒)
 isTimerRunning: boolean; // カウントダウンが稼働しているか
}

export type SecondAdjustType = 10 | 15 | 20 | 30;

// コントローラーの型定義
export interface TimerStorageData {
 action: TimerAction;
 data: TimerActionData;
}
// コントローラーのアクション定義
export type TimerAction =
 | 'start'
 | 'pause'
 | 'reset'
 | 'toggle_visibility'
 | 'initial_time'
 | 'second_adjust';

// アクションのデータ定義
export type TimerActionData = {
 timestamp?: Date;
 value?: number;
 secondAdjust?: SecondAdjustType;
};

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
