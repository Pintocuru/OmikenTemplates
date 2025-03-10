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

// ---

export type CountMode =
 | 'comment' // コメント数をカウント
 | 'commentDown' // コメント数をカウント(カウントダウン)
 | 'user' // ユーザー数をカウント
 | 'userDown' // ユーザー数をカウント(カウントダウン)
 | 'syoken'; // ユーザー数の初見さんをカウント

type Styles = {
 textColor: string;
 colorClass: string;
};

// 追加configの型定義
export interface WordCounterConfig {
 generator: {
  TARGET: number; // 目標となる数値
  IS_LOOP: boolean; // 目標達成後、色を変化させるか
  TEXTS_FIRST: string | null | undefined; // countが初期値のテキスト
  STYLES_FIRST: Styles | null | undefined; // countが初期値のカラー(TailwindCSS使用)
  TEXTS: string[] | null | undefined; // 数値が増えるたびに変化するテキスト
  TEXTS_AFTER: string[] | null | undefined; // 目標達成後、変化するテキスト(ランダム)
  STYLES: Styles[] | undefined; // 数値が増えるたびに変化するカラー(TailwindCSS使用)
  EASTER_MODE?: boolean; // Splatoonの二つ名モード(隠し)trueで上記を無視して稼働
  EASTER_DATA?: (pulseIntensity: number) => string; // Splatoonの二つ名モード(隠し)trueで上記を無視して稼働
 };
 counter: {
  COUNT_MODE: CountMode;
  PARTY: Record<number, string>; // WordPartyの発火タイミング
  PARTY_EVENT: string; // カウント増加時に発火するWordParty
  PARTY_SUCCESS: string; // TARGET_COUNT達成時に発火するWordParty
 };
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
  WORD_CONFIG?: WordCounterConfig;
 }
}
