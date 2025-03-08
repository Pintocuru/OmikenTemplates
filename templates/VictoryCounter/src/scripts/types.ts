// src/types.ts
import { ConfigUserType } from '@public/common/commonTypes';

// stateの型定義
export type WordCounterState = {
 isInitFlag: boolean;
 isUserCount: boolean;
 originUserCount: number;
 originCommentCount: number;
 userCount: number;
 commentCount: number;
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
 | 'userCountToggle' // モード切替
 | 'resetCounter'; // リセット

// アクションのデータ定義 // useWordCounterでは不使用
export type ControllerActionData = {};

// 追加configの型定義
export interface WordCounterConfig {
 IS_USER_COUNT: boolean; // ユーザー数をカウントか、コメント数をカウントか
 COUNT_PARTY: Record<number, string>; // WordPartyの発火タイミング
 COUNT_PARTY_EVENT: string; // カウント増加時に発火するWordParty
 TARGET_COUNT: number; // 目標となる数値
 LOOP_COUNT: boolean; // 目標達成後、色を変化させるか
 PROGRESS_TEXTS: string[] | undefined; // 数値が増えるたびに変化するテキスト
 PROGRESS_TEXTS_AFTER: string[] | undefined; // 目標達成後、変化するテキスト(ランダム)
 // 数値が増えるたびに変化するカラー(TailwindCSS使用)
 PROGRESS_STYLES:
  | {
     textColor: string;
     colorClass: string;
    }[]
  | undefined;
 SECOND_NAME_MODE?: boolean; // Splatoonの二つ名モード(隠し)trueで上記を無視して稼働
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
