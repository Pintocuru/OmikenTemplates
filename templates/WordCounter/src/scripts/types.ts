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
  APP_CONFIG?: WordCounterConfig;
 }
}
