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
  startTime: Date.now(),
  upVoteCount: 0,
  viewerCount: 0,
  peakUpVoteCount: 0,
  peakViewerCount: 0
 });

 const getBaseCountForMode = (mode: CountType): number =>
  ({
   none: 0,
   user: state.userCount,
   comment: state.commentCount,
   syoken: state.syokenCount,
   upVote: state.upVoteCount,
   viewer: state.viewerCount,
   gift: state.totalGift
  })[mode] || 0;

 // カウント計算
 const createCalculatedCount = (mode: CountType, target: number) => {
  // カウント値 (モード + 手動調整)
  const count = computed(() => getBaseCountForMode(mode) + state.manualAdjustment);

  // 最大値の計算 (upVote/viewerモードの場合)
  const countMax = computed(() => {
   if (target > 0) return target;
   if (mode === 'upVote') return state.peakUpVoteCount + state.manualAdjustment;
   if (mode === 'viewer') return state.peakViewerCount + state.manualAdjustment;
   return null;
  });

  return { count, countMax };
 };

 // カウンター操作
 const createCounterControls = (getCount: () => number) => ({
  increment: () => state.manualAdjustment++,
  decrement: () => {
   if (getCount() > 0) state.manualAdjustment--;
  },
  reset: () => {
   state.manualAdjustment = 0;
  }
 });

 return { state, createCalculatedCount, createCounterControls };
}
