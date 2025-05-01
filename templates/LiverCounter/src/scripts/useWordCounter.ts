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
 const isCountdownMode = counterConfig.targetCountdown > 0;

 // コンポーザブル:サービスの初期化
 const { state, createCalculatedCount, createCounterControls } = createCounterService();
 const processComment = createCommentProcessor(state);
 const processMetaUpdate = createMetaProcessor(state);

 // API接続
 const { fetchComments } = GetUserVisits(userVisitsConfig);
 const { fetchMeta } = GetMetas();

 // カウント計算
 const { displayCount, actualCount, countMax } = createCalculatedCount(
  counterConfig.countMode,
  isCountdownMode,
  counterConfig.targetCountdown
 );

 // カウンター操作
 const { increment, decrement, reset } = createCounterControls(
  isCountdownMode,
  () => displayCount.value,
  () => actualCount.value
 );

 // コンポーザブル:イベント処理
 const handleWordParty = createPartyService(counterConfig, isCountdownMode);

 // カウント変更を監視してイベントを発火
 watch(displayCount, (newCount, oldCount) => {
  handleWordParty(newCount, oldCount, state.isInitFlag, () => actualCount.value);
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
  count: displayCount,
  countMax,
  counterConfig,
  isCountdownMode,
  increment,
  decrement,
  resetManualAdjustment: reset,
  actualCount,
  initialize
 };
}
