// src/types.ts

// 時間に関する正規表現パターン
export const TIME_PATTERN =
 /(?:^|[^０-９0-9])([０-９0-9]{1,2})[:：じ時]([０-９0-9]{1,2})(?:[:：分ふん])?(?::?([０-９0-9]{1,2})(?:[秒びょう])?)?/g;

// reactiveの型定義
export interface TimerState {
 isVisible: boolean; // 表示/非表示
 isTimerRunning: boolean; // カウント中か
 countdown: number; // 残り時間(秒)
 displayTime: string; // 時刻表示
 initialTime: number; // タイマーの初期値
 secondAdjust: SecondAdjustType; // 秒数を丸める単位
 afterShow: number; // 時間経過後に表示する時間(秒)
}

export const VALID_ADJUSTS = [10, 15, 20, 30] as const;
export type SecondAdjustType = (typeof VALID_ADJUSTS)[number];

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
 ALWAYS_VISIBLE: boolean; // 常時表示させるか
 MIN_SECONDS: number; // タイマーの最低値(秒)
 MAX_SECONDS: number; // タイマーの最大値(秒)
 AFTER_SHOW: number; // 時間経過後に表示する時間(秒)
 SECOND_ADJUST: SecondAdjustType; // 秒数を丸める(default=10秒)
 COUNT_PARTY: Record<number, string>; // WordPartyの発火タイミング
 COUNT_PARTY_START: string; // タイマー起動時に発火するWordParty
 COUNT_PARTY_FINISH: string; // タイマー0で発火するWordParty
}
