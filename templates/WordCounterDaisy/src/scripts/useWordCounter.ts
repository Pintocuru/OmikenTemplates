// src/apps/scripts/useWordCounter.ts
import { computed, onMounted, reactive, watch } from 'vue';
import { WordCounterState } from './types';
import { ComponentConfig, CounterConfig, CounterSet } from './schema';
import { createProcessComment } from './createProcessComment';
import { GetUserVisits } from '@common/subscribe/GetUserVisits';
import { GetMetas } from '@common/subscribe/GetMetas';
import { postWordParty } from '@common/api/PostOneComme';
import { createHandleMetaUpdate } from './createHandleMetaUpdate';

export function useWordCounter(componentConfig: ComponentConfig, counterSet: CounterSet) {
 const counterConfig: CounterConfig = counterSet.counter;
 const userVisitsConfig = counterSet.userVisits;

 // コメントからvisitデータを生成する
 const { fetchComments } = GetUserVisits(userVisitsConfig);
 // わんコメの枠の一番上のデータを取得
 const { fetchMeta } = GetMetas();
 // カウントダウンモード
 const isCountdownMode = counterConfig.targetCountdown > 0;

 const state = reactive<WordCounterState>({
  isInitFlag: false,
  isLive: false,
  manualAdjustment: 0,
  commentCount: 0,
  userCount: 0,
  syokenCount: 0,
  upVoteCount: 0,
  viewerCount: 0,
  peakUpVoteCount: 0,
  peakViewerCount: 0
 });

 const processComment = createProcessComment(state);
 const handleMetaUpdate = createHandleMetaUpdate(state);

 const getBaseCount = () => {
  const countModeMap: Record<CounterConfig['countMode'], number> = {
   none: 0,
   user: state.userCount,
   comment: state.commentCount,
   syoken: state.syokenCount,
   upVote: state.upVoteCount,
   viewer: state.viewerCount
  };
  return countModeMap[counterConfig.countMode] || 0;
 };

 // 実際のカウントの元となる値
 const actualCount = computed(() => getBaseCount() + state.manualAdjustment);

 // 表示用カウント計算
 const count = computed(() => {
  if (isCountdownMode) {
   return Math.max(counterConfig.targetCountdown - actualCount.value, 0);
  }
  return actualCount.value;
 });

 // 変動する値(upVote/viewer)の場合、最大値を渡す
 const countMax = computed(() => {
  if (counterConfig.countMode === 'upVote') {
   const value = state.peakUpVoteCount + state.manualAdjustment;
   return isCountdownMode ? Math.max(counterConfig.targetCountdown - value, 0) : value;
  }
  if (counterConfig.countMode === 'viewer') {
   const value = state.peakViewerCount + state.manualAdjustment;
   return isCountdownMode ? Math.max(counterConfig.targetCountdown - value, 0) : value;
  }
  return null;
 });

 const increment = () => {
  if (isCountdownMode) {
   if (count.value > 0) state.manualAdjustment++;
  } else {
   state.manualAdjustment++;
  }
 };

 const decrement = () => {
  if (isCountdownMode) {
   if (actualCount.value > 0) state.manualAdjustment--;
  } else {
   if (count.value > 0) state.manualAdjustment--;
  }
 };

 const resetManualAdjustment = () => (state.manualAdjustment = 0);

 // WordParty処理
 const handleWordParty = (newCount: number, oldCount: number) => {
  if (!state.isInitFlag) return;

  const isCountIncreasing = newCount > oldCount;
  const isCountDecreasing = newCount < oldCount;
  const shouldFireEvent =
   (!isCountdownMode && isCountIncreasing) || (isCountdownMode && isCountDecreasing);

  if (shouldFireEvent && counterConfig.PARTY_EVENT) {
   postWordParty(counterConfig.PARTY_EVENT, -2);
  }

  const partyMessage = counterConfig.PARTY[newCount];
  if (partyMessage) {
   postWordParty(partyMessage, -2);
  }

  const isSuccess = isCountdownMode
   ? newCount === 0
   : actualCount.value >= counterConfig.targetCountdown;

  if (isSuccess && counterConfig.PARTY_SUCCESS) {
   postWordParty(counterConfig.PARTY_SUCCESS, -2);
  }
 };

 watch(count, handleWordParty);

 onMounted(async () => {
  document.documentElement.setAttribute('data-theme', 'dark');

  try {
   const [commentsInitialized, _] = await Promise.all([
    fetchComments(processComment), // コメント取得と処理の初期化
    fetchMeta(handleMetaUpdate) // metaタグからデータを取得
   ]);

   state.isInitFlag = commentsInitialized;
  } catch (error) {
   console.error('WordCounter initialization error:', error);
   state.isInitFlag = false;
  }
 });

 return {
  count,
  countMax,
  counterConfig,
  isCountdownMode,
  increment,
  decrement,
  resetManualAdjustment,
  actualCount
 };
}
