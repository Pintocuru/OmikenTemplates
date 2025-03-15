// src/types.ts
import { ConfigUserType } from '@public/common/commonTypes';

// 時間に関する正規表現パターン
// フルタイム表記
const HOUR_PATTERN = /(?:^|[^０-９0-9])([０-９0-9]{1,2})[:：じ時hH]/;
const MINUTE_PATTERN = /([０-９0-9]{1,2})(?:[:：分ふんmM])?/;
const SECOND_PATTERN = /:?([０-９0-9]{1,2})(?:[秒びょうsS])?/;
export const TIME_PATTERN = new RegExp(
 `${HOUR_PATTERN.source}${MINUTE_PATTERN.source}${SECOND_PATTERN.source}`,
 'g'
);
// 分単位表記
export const MINUTES_ONLY_PATTERN = /(?:^|[^０-９0-9])([０-９0-9]{1,2})[分ふんmM]/g;
// 相対時間表記
export const RELATIVE_TIME_PATTERN = /([０-９0-9]{1,3})([秒びょうsS]|[分ふんmM])後/g;
// reactiveの型定義
export interface TimerState {
 isInitFlag: boolean; // わんコメ初期化フラグ
 isVisible: boolean; // 表示/非表示
 isTimerRunning: boolean; // カウント中か
 countdown: number; // 残り時間(秒)
 displayTime: string; // 時刻表示
 initialTime: number; // タイマーの初期値
 secondAdjust: SecondAdjustType; // 秒数を丸める単位
}

export const VALID_ADJUSTS = [10, 15, 20, 30] as const;
export type SecondAdjustType = (typeof VALID_ADJUSTS)[number];

// コントローラーの型定義
export interface ControllerStorageData {
 action: ControllerAction;
 data: ControllerActionData;
}
// コントローラーのアクション定義
export type ControllerAction =
 | 'start'
 | 'pause'
 | 'reset'
 | 'toggle_visibility'
 | 'initial_time'
 | 'second_adjust';

// アクションのデータ定義
export type ControllerActionData = {
 timestamp?: Date; // 開始時間
 initialTime?: number; // 初期値
 secondAdjust?: SecondAdjustType; // 丸める秒数
};

// 時間を時間・分・秒で分解する
export interface TimeParts {
 hours: number;
 minutes: number;
 seconds: number;
}

// 追加configの型定義
export interface NextTimerConfig {
 MIN_SECONDS: number; // タイマーの最低値(秒)
 MAX_SECONDS: number; // タイマーの最大値(秒)
 ALWAYS_VISIBLE: boolean; // 常時表示させるか
 AFTER_SHOW: number; // 時間経過後に表示する時間(秒)
 SECOND_ADJUST: SecondAdjustType; // 秒数を丸める(default=10秒)
 PARTY: Record<number, string>; // WordPartyの発火タイミング
 PARTY_START: string; // タイマー起動時に発火するWordParty
 PARTY_FINISH: string; // タイマー0で発火するWordParty
}

// ---

// グローバル変数の型定義
declare global {
 interface Window {
  AppComponent: {
   component: any;
   initApp: any;
  };
  CONFIG?: ConfigUserType;
  TIME_CONFIG?: NextTimerConfig;
 }
}
