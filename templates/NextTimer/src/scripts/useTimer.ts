// useTimer.ts
import { reactive, computed, onUnmounted, toRefs, onMounted } from 'vue';
import { NextTimerConfigType } from './types';
import { TimeProcessor } from './utils';
import { postWordParty } from '@common/api/PostOneComme';

export function useTimer(timeConfig: NextTimerConfigType) {
 // state
 const state = reactive({
  displayTime: null as string | null,
  countdown: null as number | null,
  isVisible: timeConfig.ALWAYS_VISIBLE,
  isHuwahuwa: false,
  isPaused: false
 });

 // timer
 const timers = {
  countdown: null as number | null,
  hide: null as ReturnType<typeof setTimeout> | null
 };

 // class群
 const timeProcessor = new TimeProcessor(timeConfig);
 // 桁ごとの数字を返す
 const countdownDigits = computed(
  () => state.countdown?.toString().padStart(2, '0').split('').map(Number) || []
 );

 // LocalStorage を使って外部ブラウザから操作する
 const handleStorageChange = (event: StorageEvent) => {
  if (event.key === 'timer_control') {
   const data = JSON.parse(event.newValue || '');

   switch (data.action) {
    case 'start':
     if (data.timestamp) {
      const targetTime = new Date(data.timestamp);
      startCountdown(targetTime);
     }
     break;

    case 'pause':
     if (timers.countdown) {
      cancelAnimationFrame(timers.countdown);
      state.isPaused = true;
     }
     break;

    case 'reset':
     cleanup();
     state.displayTime = null;
     state.countdown = null;
     state.isVisible = timeConfig.ALWAYS_VISIBLE;
     state.isPaused = false;
     break;

    case 'toggle_visibility':
     state.isVisible = !state.isVisible;
     break;
   }
  }
 };

 // 時間ごとにWordPartyを投稿
 const handleCountdownParty = (seconds: number, calledAt: Record<number, boolean>) => {
  const secondsToCall = Object.keys(timeConfig.COUNT_PARTY)
   .map(Number)
   .sort((a, b) => b - a);

  for (const second of secondsToCall) {
   if (seconds <= second && !calledAt[second]) {
    postWordParty(timeConfig.COUNT_PARTY[second], -2);
    calledAt[second] = true;
    break;
   }
  }
 };

 // カウントダウンを開始
 const startCountdown = (targetTime: Date) => {
  cleanup();
  const calledAt: Record<number, boolean> = {};
  state.isPaused = false;
  state.isVisible = true;
  state.displayTime = targetTime.toTimeString().slice(0, 8);

  if (!calledAt[-1]) {
   postWordParty(timeConfig.COUNT_PARTY_START, -2);
   calledAt[-1] = true;
  }

  const updateCountdown = () => {
   const diff = targetTime.getTime() - Date.now();
   if (diff > 0) {
    state.isHuwahuwa = true;
    state.countdown = Math.ceil(diff / 1000);
    handleCountdownParty(state.countdown, calledAt);
    timers.countdown = requestAnimationFrame(updateCountdown);
   } else {
    finishCountdown(calledAt);
   }
  };

  updateCountdown();
 };

 // 終了時にWordPartyを投稿
 const finishCountdown = (calledAt: Record<number, boolean>) => {
  state.countdown = 0;
  state.isHuwahuwa = false;
  if (!calledAt[0]) {
   postWordParty(timeConfig.COUNT_PARTY_FINISH, -2);
   calledAt[0] = true;
  }
  if (!timeConfig.ALWAYS_VISIBLE) {
   timers.hide = setTimeout(() => (state.isVisible = false), timeConfig.AFTER_SHOW * 1000);
  }
 };

 // メイン基幹
 const processComment = (comment: string) => {
  const absoluteResult = timeProcessor.processAbsoluteTime(comment);
  const relativeResult = timeProcessor.processRelativeTime(comment);

  if (absoluteResult.success && absoluteResult.times) {
   absoluteResult.times.forEach((targetTime) => {
    state.displayTime = targetTime.toTimeString().slice(0, 8);
    state.isVisible = true;
    startCountdown(targetTime);
   });
  }

  if (relativeResult.success && relativeResult.times) {
   relativeResult.times.forEach((targetTime) => {
    if (targetTime.getTime() - Date.now() >= 10000) {
     state.displayTime = targetTime.toTimeString().slice(0, 8);
     state.isVisible = true;
     startCountdown(targetTime);
    }
   });
  }
 };

 // 初期化時に LocalStorage を稼働
 onMounted(() => {
  window.addEventListener('storage', handleStorageChange);
 });

 // クリーンアップ
 const cleanup = () => {
  if (timers.countdown) cancelAnimationFrame(timers.countdown);
  if (timers.hide) clearTimeout(timers.hide);
 };

 // コンポーネントのアンマウント時にクリーンアップ
 onUnmounted(() => {
  window.removeEventListener('storage', handleStorageChange);
  cleanup();
 });

 return {
  ...toRefs(state),
  countdownDigits,
  processComment,
  cleanup
 };
}
