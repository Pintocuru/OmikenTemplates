// src/apps/scripts/useWordCounter.ts
import { watch } from 'vue';
import { CounterSet } from './schema';
import { GetUserVisits } from '@common/subscribe/GetUserVisits';
import { GetMetas } from '@common/subscribe/GetMetas';

import { createCounterService } from './counterService';
import { createCommentProcessor } from './commentProcessor';
import { createMetaProcessor } from './metaProcessor';
import { createPartyService } from './partyService';

export function useWordCounter(counterSet: CounterSet) {
 const { counter: counterConfig, userVisits: userVisitsConfig } = counterSet;

 // コンポーザブル:サービスの初期化
 const { state, createCalculatedCount, createCounterControls } = createCounterService();
 const processComment = createCommentProcessor(state);
 const processMetaUpdate = createMetaProcessor(state);

 // API接続
 const { fetchComments } = GetUserVisits(userVisitsConfig);
 const { fetchMeta } = GetMetas();

 // カウント計算
 const { count, countMax } = createCalculatedCount(
  counterConfig.countMode,
  counterConfig.targetCountdown
 );

 // カウンター操作
 const { increment, decrement, reset } = createCounterControls(() => count.value);

 // コンポーザブル:イベント処理
 const handleWordParty = createPartyService(counterConfig);

 // カウント変更を監視してイベントを発火
 watch(count, (newCount, oldCount) => {
  handleWordParty(newCount, oldCount, state.isInitFlag, () => count.value);
 });

 // 初期化関数を定義
 const initialize = async () => {
  try {
   await Promise.all([fetchComments(processComment), fetchMeta(processMetaUpdate)]);
  } catch (error) {
   console.error('WordCounter initialization error:', error);
   state.isInitFlag = false;
  }
 };

 return {
  state,
  count,
  countMax,
  counterConfig,
  increment,
  decrement,
  resetManualAdjustment: reset,
  initialize
 };
}
