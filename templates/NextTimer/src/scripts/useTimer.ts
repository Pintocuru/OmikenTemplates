// useTimer.ts
import { reactive, computed, onUnmounted, toRefs, onMounted } from 'vue';
import { NextTimerConfigType, TimerAction } from './types';
import { TimerAbsolute } from './TimerAbsolute';
import { postWordParty } from '@common/api/PostOneComme';
import { TimerStorageController } from './TimerStorage';

export function useTimer(timeConfig: NextTimerConfigType) {
 // state
 const state = reactive({
  isVisible: timeConfig.ALWAYS_VISIBLE, // 表示/非表示
  initialTime: 30 as number, // タイマーの初期値
  secondAdjust: timeConfig.SECOND_ADJUST, // 秒数を丸める単位
  displayTime: null as string | null, // カウントが0になる時刻
  countdown: null as number | null, // 残り時間(秒)
  isTimerRunning: false // カウントダウンが稼働しているか
 });

 // timer
 const timers = {
  countdown: null as number | null,
  hide: null as ReturnType<typeof setTimeout> | null
 };

 // class群
 const timeProcessor = new TimerAbsolute(timeConfig);
 const storageController = new TimerStorageController();

 // 桁ごとの数字を返す
 const countdownDigits = computed(
  () => state.countdown?.toString().padStart(2, '0').split('').map(Number) || []
 );

 // LocalStorage を使って外部ブラウザから操作する
 const handleTimerAction = (action: TimerAction, timestamp?: Date) => {
  switch (action) {
   case 'start':
    if (timestamp) {
     startCountdown(timestamp);
    }
    break;
   case 'pause':
    if (timers.countdown) {
     cancelAnimationFrame(timers.countdown);
     state.isTimerRunning = false;
    }
    break;
   case 'reset':
    cleanup();
    state.displayTime = null;
    state.countdown = null;
    state.isTimerRunning = false;
    break;
   case 'toggle_visibility':
    state.isVisible = !state.isVisible;
    break;
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
  state.isTimerRunning = true;
  state.isVisible = true;
  state.displayTime = targetTime.toTimeString().slice(0, 8);

  if (!calledAt[-1]) {
   postWordParty(timeConfig.COUNT_PARTY_START, -2);
   calledAt[-1] = true;
  }

  const updateCountdown = () => {
   const diff = targetTime.getTime() - Date.now();
   if (diff > 0) {
    state.isTimerRunning = true;
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
  state.isTimerRunning = false;
  if (!calledAt[0]) {
   postWordParty(timeConfig.COUNT_PARTY_FINISH, -2);
   calledAt[0] = true;
  }
  if (!timeConfig.ALWAYS_VISIBLE) {
   timers.hide = setTimeout(() => (state.isVisible = false), timeConfig.AFTER_SHOW * 1000);
  }
 };

 // コメントによるタイマー発動(絶対時間のみ)
 const processComment = (comment: string) => {
  const times = timeProcessor.processTime(comment);
  if (times) {
   times.forEach((targetTime) => {
    state.displayTime = targetTime.toTimeString().slice(0, 8);
    state.isVisible = true;
    startCountdown(targetTime);
   });
  }
 };

 // 初期化時に LocalStorage を稼働
 onMounted(() => {
  storageController.initialize();
  storageController.addListener(handleTimerAction);
 });

 // クリーンアップ
 const cleanup = () => {
  if (timers.countdown) cancelAnimationFrame(timers.countdown);
  if (timers.hide) clearTimeout(timers.hide);
 };

 // コンポーネントのアンマウント時にクリーンアップ
 onUnmounted(() => {
  storageController.cleanup();
  cleanup();
 });

 return {
  ...toRefs(state),
  countdownDigits,
  processComment,
  cleanup
 };
}
