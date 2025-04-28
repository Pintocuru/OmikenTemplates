// src/apps/scripts/counterService.ts
import { computed, reactive } from 'vue';
import { WordCounterState } from './types';
import { CountType } from './schema';

export function createCounterService() {
 const state = reactive<WordCounterState>({
  // Counter state
  isInitFlag: false,
  manualAdjustment: 0,

  // Comment metrics
  commentCount: 0,
  userCount: 0,
  syokenCount: 0,
  totalGift: 0,

  // Stream metrics
  isLive: false,
  upVoteCount: 0,
  viewerCount: 0,
  peakUpVoteCount: 0,
  peakViewerCount: 0
 });

 const getBaseCountForMode = (countMode: CountType): number => {
  const countModeMap: Record<CountType, number> = {
   none: 0,
   user: state.userCount,
   comment: state.commentCount,
   syoken: state.syokenCount,
   upVote: state.upVoteCount,
   viewer: state.viewerCount,
   gift: state.totalGift
  };
  return countModeMap[countMode] || 0;
 };

 const createCalculatedCount = (countMode: CountType, isCountdown: boolean, target: number) => {
  // 実際のカウント値 (モード + 手動調整)
  const actualCount = computed(() => getBaseCountForMode(countMode) + state.manualAdjustment);

  // 表示用カウント値 (カウントダウンモードの場合は逆算)
  const displayCount = computed(() => {
   if (isCountdown) {
    return Math.max(target - actualCount.value, 0);
   }
   return actualCount.value;
  });

  // 最大値の計算 (upVote/viewerモードの場合)
  const maxCount = computed(() => {
   if (countMode === 'upVote') {
    const value = state.peakUpVoteCount + state.manualAdjustment;
    return isCountdown ? Math.max(target - value, 0) : value;
   }
   if (countMode === 'viewer') {
    const value = state.peakViewerCount + state.manualAdjustment;
    return isCountdown ? Math.max(target - value, 0) : value;
   }
   return null;
  });

  return { actualCount, displayCount, maxCount };
 };

 const createCounterControls = (
  isCountdown: boolean,
  getCount: () => number,
  getActualCount: () => number
 ) => {
  return {
   increment: () => {
    if (isCountdown) {
     if (getCount() > 0) state.manualAdjustment++;
    } else {
     state.manualAdjustment++;
    }
   },

   decrement: () => {
    if (isCountdown) {
     if (getActualCount() > 0) state.manualAdjustment--;
    } else {
     if (getCount() > 0) state.manualAdjustment--;
    }
   },

   reset: () => {
    state.manualAdjustment = 0;
   }
  };
 };

 return {
  state,
  createCalculatedCount,
  createCounterControls
 };
}
