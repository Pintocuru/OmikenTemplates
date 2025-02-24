import { reactive, computed, onUnmounted, toRefs, onMounted, Ref, watchEffect } from 'vue';
import type {
 NextTimerConfigType,
 SecondAdjustType,
 TimerAction,
 TimerActionData,
 TimerState
} from './types';
import { TimerAbsolute } from './TimerAbsolute';
import { postWordParty } from '@common/api/PostOneComme';
import { TimerStorageController } from './TimerStorage';

export function useTimer(config: NextTimerConfigType, isInitFlagRef: Ref<boolean>) {
 // 状態管理
 const state = reactive<TimerState>({
  isVisible: config.ALWAYS_VISIBLE,
  initialTime: 30,
  displayTime: null,
  secondAdjust: config.SECOND_ADJUST as SecondAdjustType,
  countdown: null,
  isTimerRunning: false
 });

 // タイマーリソース管理
 const timers = {
  countdown: null as number | null,
  hide: null as ReturnType<typeof setTimeout> | null
 };

 // プロセッサー初期化
 const isInitFlag = computed(() => isInitFlagRef.value);
 const timeProcessor = new TimerAbsolute();
 const storageController = new TimerStorageController();

 // 桁ごとの数字を返す
 const countdownDigits = computed(
  () => state.countdown?.toString().padStart(2, '0').split('').map(Number) || []
 );

 // クリーンアップ関数
 const cleanup = () => {
  if (timers.countdown) cancelAnimationFrame(timers.countdown);
  if (timers.hide) clearTimeout(timers.hide);
 };

 // WordParty投稿ハンドラー
 const handleWordParty = (type: string) => {
  if (isInitFlag.value) postWordParty(type, -2);
  return true;
 };

 // カウントダウンを終了
 const finishCountdown = (calledAt: Record<number, boolean>) => {
  state.countdown = 0;
  state.isTimerRunning = false;

  if (!calledAt[0]) {
   calledAt[0] = handleWordParty(config.COUNT_PARTY_FINISH);
  }

  if (!config.ALWAYS_VISIBLE) {
   timers.hide = setTimeout(() => (state.isVisible = false), config.AFTER_SHOW * 1000);
  }
 };

 // カウントダウン中の処理
 const handleCountdownParty = (seconds: number, calledAt: Record<number, boolean>) => {
  const secondsToCall = Object.keys(config.COUNT_PARTY)
   .map(Number)
   .sort((a, b) => b - a)
   .find((second) => seconds <= second && !calledAt[second]);

  if (secondsToCall !== undefined) {
   calledAt[secondsToCall] = handleWordParty(config.COUNT_PARTY[secondsToCall]);
  }
 };

 // カウントダウンを開始
 const startCountdown = (targetTime: Date) => {
  cleanup();

  const calledAt: Record<number, boolean> = {};

  state.isVisible = true;
  state.isTimerRunning = true;
  state.displayTime = targetTime.toTimeString().slice(0, 8);

  if (!calledAt[-1]) {
   calledAt[-1] = handleWordParty(config.COUNT_PARTY_START);
  }

  const updateCountdown = () => {
   const diff = targetTime.getTime() - Date.now();

   if (diff > 0) {
    state.countdown = Math.ceil(diff / 1000);
    handleCountdownParty(state.countdown, calledAt);
    timers.countdown = requestAnimationFrame(updateCountdown);
   } else {
    finishCountdown(calledAt);
   }
  };

  updateCountdown();
 };

 // タイマーアクション処理
 const handleTimerAction = (action: TimerAction, data: TimerActionData) => {
  const actions: Record<TimerAction, () => void> = {
   start: () => {
    if (data.timestamp) {
     startCountdown(timeProcessor.processTime(data.timestamp, state.secondAdjust) as Date);
    }
   },
   pause: () => {
    if (timers.countdown) {
     cancelAnimationFrame(timers.countdown);
     state.isTimerRunning = false;
    }
   },
   reset: () => {
    cleanup();
    state.countdown = state.initialTime;
    state.displayTime = '---';
    state.isTimerRunning = false;
   },
   toggle_visibility: () => {
    if (state.isVisible && timers.countdown) {
     cancelAnimationFrame(timers.countdown);
     state.isTimerRunning = false;
    }
    state.isVisible = !state.isVisible;
   },
   initial_time: () => {
    if (data.value && !state.isTimerRunning) {
     state.initialTime = data.value;
     state.countdown = data.value;
     state.displayTime = '---';
    }
   },
   second_adjust: () => {
    if (data.value && [10, 15, 20, 30].includes(data.value)) {
     state.secondAdjust = data.value as SecondAdjustType;
    }
   }
  };

  if (action in actions) actions[action]();
 };

 // コメントによるタイマー発動
 const processComment = (comment: string) => {
  const time = timeProcessor.processTime(comment, state.secondAdjust);
  if (time) startCountdown(time);
 };

 // 初期化時に LocalStorage を稼働
 onMounted(() => {
  storageController.initialize();
  storageController.addListener(handleTimerAction);
 });

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
