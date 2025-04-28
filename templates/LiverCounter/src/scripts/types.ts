// src/types.ts
import { ComponentConfig, ComponentType, CounterSet } from './schema';

// stateの型定義
export type WordCounterState = {
 isInitFlag: boolean; // わんコメ初期化フラグ]
 isLive: boolean; // metaからライブ中かを取得
 manualAdjustment: number; // 手動で加算・減算した数値
 commentCount: number; // fetchCommentsで取得した基本コメント数
 userCount: number; // fetchCommentsで取得した基本ユーザー数
 syokenCount: number; // fetchCommentsで取得した基本ユーザー数のうち、初見さん
 upVoteCount: number; // metaで取得した高評価数
 viewerCount: number; // metaで取得した視聴者数
 peakUpVoteCount: number; // 過去最高の高評価数
 peakViewerCount: number; // 最大視聴者数
 totalGift: number; // ギフト金額の合計値
};

// ---

// グローバル変数の型定義
declare global {
 interface Window {
  components: Record<ComponentType, any>;
  initApp: any;
  componentConfig: ComponentConfig;
  counterSets: CounterSet[];
 }
}
