import { reactive, computed, onUnmounted, toRefs, onMounted, Ref } from 'vue';
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
 const state = reactive<TimerState>({
  isVisible: config.ALWAYS_VISIBLE,
  initialTime: 30,
  displayTime: null,
  secondAdjust: config.SECOND_ADJUST as SecondAdjustType,
  countdown: null,
  isTimerRunning: false
 });

 const timers = {
  countdown: null as number | null,
  hide: null as ReturnType<typeof setTimeout> | null
 };

 // class群
 const timeProcessor = new TimerAbsolute(config);
 const storageController = new TimerStorageController();

 // 桁ごとの数字を返す
 const countdownDigits = computed(
  () => state.countdown?.toString().padStart(2, '0').split('').map(Number) || []
 );

 // 時間ごとにWordPartyを投稿
 const handleCountdownParty = (seconds: number, calledAt: Record<number, boolean>) => {
  const secondsToCall = Object.keys(config.COUNT_PARTY)
   .map(Number)
   .sort((a, b) => b - a)
   .find((second) => seconds <= second && !calledAt[second]);

  if (secondsToCall !== undefined && isInitFlagRef.value) {
   postWordParty(config.COUNT_PARTY[secondsToCall], -2);
   calledAt[secondsToCall] = true;
  }
 };

 // 終了時にWordPartyを投稿
 const finishCountdown = (calledAt: Record<number, boolean>) => {
  state.countdown = 0;
  state.isTimerRunning = false;

  if (!calledAt[0] && isInitFlagRef.value) {
   postWordParty(config.COUNT_PARTY_FINISH, -2);
   calledAt[0] = true;
  }

  if (!config.ALWAYS_VISIBLE) {
   timers.hide = setTimeout(() => (state.isVisible = false), config.AFTER_SHOW * 1000);
  }
 };

 // カウントダウンを開始
 const startCountdown = (targetTime: Date) => {
  cleanup();
  const calledAt: Record<number, boolean> = {};

  Object.assign(state, {
   isTimerRunning: true,
   isVisible: true,
   displayTime: targetTime.toTimeString().slice(0, 8)
  });

  if (isInitFlagRef.value && !calledAt[-1]) {
   postWordParty(config.COUNT_PARTY_START, -2);
   calledAt[-1] = true;
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

 // LocalStorage を使って外部ブラウザから操作する
 const handleTimerAction = (action: TimerAction, data: TimerActionData) => {
  const actions = {
   start: () => {
    if (data.timestamp) {
     state.isVisible = true;
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
    const timestamp = timeProcessor.processTime(
     new Date(Date.now() + state.initialTime * 1000),
     state.secondAdjust
    ) as Date;

    Object.assign(state, {
     countdown: state.initialTime,
     displayTime: timestamp.toTimeString().slice(0, 8),
     isTimerRunning: false
    });
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
     const timestamp = timeProcessor.processTime(
      new Date(Date.now() + data.value * 1000),
      state.secondAdjust
     ) as Date;

     Object.assign(state, {
      initialTime: data.value,
      countdown: data.value,
      displayTime: timestamp.toTimeString().slice(0, 8)
     });
    }
   },
   second_adjust: () => {
    if (data.value && [10, 15, 20, 30].includes(data.value)) {
     state.secondAdjust = data.value as SecondAdjustType;
     if (!state.isTimerRunning) {
      const timestamp = timeProcessor.processTime(
       new Date(Date.now() + state.initialTime * 1000),
       state.secondAdjust
      ) as Date;
      state.displayTime = timestamp.toTimeString().slice(0, 8);
     }
    }
   }
  };

  actions[action]?.();
 };

 // コメントによるタイマー発動(絶対時間のみ)
 const processComment = (comment: string) => {
  const time = timeProcessor.processTime(comment, state.secondAdjust);
  if (time) {
   state.displayTime = time.toTimeString().slice(0, 8);
   state.isVisible = true;
   startCountdown(time);
  }
 };

 // クリーンアップ
 const cleanup = () => {
  timers.countdown && cancelAnimationFrame(timers.countdown);
  timers.hide && clearTimeout(timers.hide);
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
