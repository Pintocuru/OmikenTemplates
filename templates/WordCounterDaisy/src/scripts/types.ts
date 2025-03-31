// src/types.ts
import { ConfigUserType } from '@public/common/commonTypes';

// stateの型定義
export type WordCounterState = {
 isInitFlag: boolean; // わんコメ初期化フラグ
 commentCount: number; // fetchCommentsで取得した基本コメント数
 userCount: number; // fetchCommentsで取得した基本ユーザー数
 syokenCount: number; // fetchCommentsで取得した基本ユーザー数のうち、初見さん
 manualAdjustment: number; // 手動で加算・減算した数値
};

// ---

// グローバル変数の型定義
declare global {
 interface Window {
  AppComponent: {
   component: any;
   initApp: any;
  };
  counterSets: CounterSet[];
 }
}

export type CounterSet = {
 id: string;
 userVisitsConfig: ConfigUserType;
 wordConfig: WordCounterConfig;
};

export interface WordCounterConfig {
 generator: GeneratorConfig;
 counter: CounterConfig;
}

export interface GeneratorConfig {
 TARGET: number; // 目標となる数値
 IS_LOOP: boolean; // 目標達成後、色を変化させるか
 TEXTS_FIRST?: string | null; // countが初期値のテキスト
 STYLES_FIRST?: Styles | null; // countが初期値のカラー(TailwindCSS使用)
 TEXTS: string[] | null; // 数値が増えるたびに変化するテキスト
 TEXTS_AFTER: string[] | null; // 目標達成後、変化するテキスト(ランダム)
 STYLES: Styles[]; // 数値が増えるたびに変化するカラー(TailwindCSS使用)
 EASTER_MODE?: boolean; // Splatoonの二つ名モード(隠し)trueで上記を無視して稼働
 EASTER_DATA?: (pulseIntensity: number) => string; // Splatoonの二つ名モード(隠し)trueで上記を無視して稼働
}

type Styles = {
 textColor: string;
 colorClass: string;
};

export interface CounterConfig {
 COUNT_MODE:
  | 'comment' // コメント数をカウント
  | 'user' // ユーザー数をカウント
  | 'syoken'; // ユーザー数の初見さんをカウント
 IS_DOWN: boolean; // カウントダウンモード
 MULTIPLIER: number; // 振る舞いに掛け算を適用する場合の乗数
 PARTY: Record<number, string>; // WordPartyの発火タイミング
 PARTY_EVENT: string; // カウント増加時に発火するWordParty
 PARTY_SUCCESS: string; // TARGET_COUNT達成時に発火するWordParty
}

// ---

// 恐らく使わない

// コントローラーの型定義
export interface ControllerStorageData {
 action: ControllerAction;
 data: ControllerActionData; // useWordCounterでは不使用
}
// コントローラーのアクション定義
export type ControllerAction =
 | 'countUp' // カウントアップ
 | 'countDown' // カウントダウン
 | 'resetCounter'; // リセット

// アクションのデータ定義 // useWordCounterでは不使用
export type ControllerActionData = {};
